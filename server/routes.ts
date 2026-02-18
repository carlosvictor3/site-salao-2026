import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingServices = await storage.getServices();
  
  if (existingServices.length === 0) {
    const corteService = await storage.createService({
      name: "Corte de Cabelo Feminino",
      description: "Corte moderno e personalizado de acordo com seu estilo. Inclui lavagem, corte e finalização com secador.",
      price: "80.00",
      duration: 60,
      category: "Cabelo",
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      isActive: true,
    });

    const manicureService = await storage.createService({
      name: "Manicure Completa",
      description: "Tratamento completo para as unhas das mãos com esmaltação tradicional ou em gel.",
      price: "45.00",
      duration: 45,
      category: "Unhas",
      imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
      isActive: true,
    });

    const massagemService = await storage.createService({
      name: "Massagem Relaxante",
      description: "Massagem terapêutica para aliviar tensões musculares e promover relaxamento profundo.",
      price: "120.00",
      duration: 90,
      category: "Massagem",
      imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      isActive: true,
    });

    const designService = await storage.createService({
      name: "Design de Sobrancelhas",
      description: "Modelagem e design de sobrancelhas com henna ou pinça para realçar o olhar.",
      price: "35.00",
      duration: 30,
      category: "Estética",
      imageUrl: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80",
      isActive: true,
    });

    const limpezaService = await storage.createService({
      name: "Limpeza de Pele Profunda",
      description: "Tratamento facial completo com extração de cravos, hidratação e máscara específica para seu tipo de pele.",
      price: "150.00",
      duration: 120,
      category: "Estética",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      isActive: true,
    });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    await storage.createPromotion({
      serviceId: corteService.id,
      title: "Promoção Especial - Corte Feminino",
      description: "Aproveite 25% de desconto em corte de cabelo feminino! Válido para novos e antigos clientes.",
      discountPercentage: 25,
      originalPrice: "80.00",
      promotionalPrice: "60.00",
      isActive: true,
      startDate: new Date(),
      endDate: endDate,
    });

    await storage.createPromotion({
      serviceId: massagemService.id,
      title: "Relaxe e Economize",
      description: "Massagem relaxante com 20% de desconto. Cuide do seu bem-estar!",
      discountPercentage: 20,
      originalPrice: "120.00",
      promotionalPrice: "96.00",
      isActive: true,
      startDate: new Date(),
      endDate: endDate,
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedDatabase();

  app.get(api.services.list.path, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar serviços' });
    }
  });

  app.get(api.services.get.path, async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar serviço' });
    }
  });

  app.post(api.services.create.path, async (req, res) => {
    try {
      const bodySchema = api.services.create.input.extend({
        price: z.coerce.string(),
        duration: z.coerce.number(),
      });
      const input = bodySchema.parse(req.body);
      const service = await storage.createService(input);
      res.status(201).json(service);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: 'Erro ao criar serviço' });
    }
  });

  app.put(api.services.update.path, async (req, res) => {
    try {
      const bodySchema = api.services.update.input.extend({
        price: z.coerce.string().optional(),
        duration: z.coerce.number().optional(),
      });
      const input = bodySchema.parse(req.body);
      const service = await storage.updateService(req.params.id, input);
      if (!service) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }
      res.json(service);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: 'Erro ao atualizar serviço' });
    }
  });

  app.delete(api.services.delete.path, async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar serviço' });
    }
  });

  app.get(api.promotions.list.path, async (req, res) => {
    try {
      const promotions = await storage.getPromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar promoções' });
    }
  });

  app.get(api.promotions.active.path, async (req, res) => {
    try {
      const promotions = await storage.getActivePromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar promoções ativas' });
    }
  });

  app.get(api.promotions.get.path, async (req, res) => {
    try {
      const promotion = await storage.getPromotion(req.params.id);
      if (!promotion) {
        return res.status(404).json({ message: 'Promoção não encontrada' });
      }
      res.json(promotion);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar promoção' });
    }
  });

  app.post(api.promotions.create.path, async (req, res) => {
    try {
      const bodySchema = api.promotions.create.input.extend({
        discountPercentage: z.coerce.number(),
        originalPrice: z.coerce.string(),
        promotionalPrice: z.coerce.string(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      });
      const input = bodySchema.parse(req.body);
      const promotion = await storage.createPromotion(input);
      res.status(201).json(promotion);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: 'Erro ao criar promoção' });
    }
  });

  app.put(api.promotions.update.path, async (req, res) => {
    try {
      const bodySchema = api.promotions.update.input.extend({
        discountPercentage: z.coerce.number().optional(),
        originalPrice: z.coerce.string().optional(),
        promotionalPrice: z.coerce.string().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
      });
      const input = bodySchema.parse(req.body);
      const promotion = await storage.updatePromotion(req.params.id, input);
      if (!promotion) {
        return res.status(404).json({ message: 'Promoção não encontrada' });
      }
      res.json(promotion);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: 'Erro ao atualizar promoção' });
    }
  });

  app.delete(api.promotions.delete.path, async (req, res) => {
    try {
      await storage.deletePromotion(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar promoção' });
    }
  });

  app.get(api.orders.list.path, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const orders = await storage.getOrders(status);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pedido' });
    }
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: 'Erro ao criar pedido' });
    }
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    try {
      const input = api.orders.updateStatus.input.parse(req.body);
      const order = await storage.updateOrderStatus(req.params.id, input.status);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      res.json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
    }
  });

  return httpServer;
}
