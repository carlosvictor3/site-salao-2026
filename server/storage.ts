import { db } from "./db";
import {
  services,
  promotions,
  orders,
  orderItems,
  type Service,
  type Promotion,
  type Order,
  type OrderItem,
  type CreateServiceRequest,
  type UpdateServiceRequest,
  type ServiceResponse,
  type CreatePromotionRequest,
  type UpdatePromotionRequest,
  type PromotionResponse,
  type CreateOrderRequest,
  type OrderResponse,
} from "@shared/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  getServices(): Promise<ServiceResponse[]>;
  getActiveServices(): Promise<ServiceResponse[]>;
  getService(id: string): Promise<ServiceResponse | undefined>;
  createService(service: CreateServiceRequest): Promise<ServiceResponse>;
  updateService(id: string, updates: UpdateServiceRequest): Promise<ServiceResponse | undefined>;
  deleteService(id: string): Promise<void>;

  getPromotions(): Promise<PromotionResponse[]>;
  getActivePromotions(): Promise<PromotionResponse[]>;
  getPromotion(id: string): Promise<PromotionResponse | undefined>;
  createPromotion(promotion: CreatePromotionRequest): Promise<PromotionResponse>;
  updatePromotion(id: string, updates: UpdatePromotionRequest): Promise<PromotionResponse | undefined>;
  deletePromotion(id: string): Promise<void>;

  getOrders(statusFilter?: string): Promise<OrderResponse[]>;
  getOrder(id: string): Promise<OrderResponse | undefined>;
  createOrder(order: CreateOrderRequest): Promise<OrderResponse>;
  updateOrderStatus(id: string, status: string): Promise<OrderResponse | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getServices(): Promise<ServiceResponse[]> {
    return await db.select().from(services).orderBy(desc(services.createdAt));
  }

  async getActiveServices(): Promise<ServiceResponse[]> {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(desc(services.createdAt));
  }

  async getService(id: string): Promise<ServiceResponse | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async createService(service: CreateServiceRequest): Promise<ServiceResponse> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: string, updates: UpdateServiceRequest): Promise<ServiceResponse | undefined> {
    const [updated] = await db.update(services)
      .set(updates)
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getPromotions(): Promise<PromotionResponse[]> {
    const result = await db
      .select()
      .from(promotions)
      .leftJoin(services, eq(promotions.serviceId, services.id))
      .orderBy(desc(promotions.createdAt));
    
    return result.map(row => ({
      ...row.promotions,
      service: row.services!,
    }));
  }

  async getActivePromotions(): Promise<PromotionResponse[]> {
    const now = new Date();
    const result = await db
      .select()
      .from(promotions)
      .leftJoin(services, eq(promotions.serviceId, services.id))
      .where(
        and(
          eq(promotions.isActive, true),
          lte(promotions.startDate, now),
          gte(promotions.endDate, now)
        )
      )
      .orderBy(desc(promotions.createdAt));
    
    return result.map(row => ({
      ...row.promotions,
      service: row.services!,
    }));
  }

  async getPromotion(id: string): Promise<PromotionResponse | undefined> {
    const result = await db
      .select()
      .from(promotions)
      .leftJoin(services, eq(promotions.serviceId, services.id))
      .where(eq(promotions.id, id));
    
    if (result.length === 0) return undefined;
    
    return {
      ...result[0].promotions,
      service: result[0].services!,
    };
  }

  async createPromotion(promotion: CreatePromotionRequest): Promise<PromotionResponse> {
    const [created] = await db.insert(promotions).values(promotion).returning();
    const service = await this.getService(created.serviceId);
    return {
      ...created,
      service: service!,
    };
  }

  async updatePromotion(id: string, updates: UpdatePromotionRequest): Promise<PromotionResponse | undefined> {
    const [updated] = await db.update(promotions)
      .set(updates)
      .where(eq(promotions.id, id))
      .returning();
    
    if (!updated) return undefined;
    
    const service = await this.getService(updated.serviceId);
    return {
      ...updated,
      service: service!,
    };
  }

  async deletePromotion(id: string): Promise<void> {
    await db.delete(promotions).where(eq(promotions.id, id));
  }

  async getOrders(statusFilter?: string): Promise<OrderResponse[]> {
    const query = db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    
    const ordersResult = statusFilter
      ? await query.where(eq(orders.status, statusFilter))
      : await query;

    const ordersWithItems = await Promise.all(
      ordersResult.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        return {
          ...order,
          items,
        };
      })
    );

    return ordersWithItems;
  }

  async getOrder(id: string): Promise<OrderResponse | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    return {
      ...order,
      items,
    };
  }

  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    const totalAmount = orderData.items.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    const [order] = await db.insert(orders).values({
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      notes: orderData.notes,
      totalAmount: totalAmount.toFixed(2),
      status: 'pending',
    }).returning();

    const items = await Promise.all(
      orderData.items.map(async (item) => {
        const [orderItem] = await db.insert(orderItems).values({
          orderId: order.id,
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          price: item.price,
          quantity: item.quantity,
          promotionId: item.promotionId,
        }).returning();
        return orderItem;
      })
    );

    return {
      ...order,
      items,
    };
  }

  async updateOrderStatus(id: string, status: string): Promise<OrderResponse | undefined> {
    const [updated] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    
    if (!updated) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    return {
      ...updated,
      items,
    };
  }
}

export const storage = new DatabaseStorage();
