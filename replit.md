# Salão de Beleza - E-commerce

## Visão Geral
Site de e-commerce para salão de beleza onde clientes podem comprar serviços online para realizar posteriormente no salão físico.

## Funcionalidades
- Catálogo de serviços com categorias (Cabelo, Unhas, Estética, Massagem)
- Sistema de promoções com descontos
- Carrinho de compras
- Checkout com dados do cliente
- Painel administrativo para gerenciar serviços e promoções
- Gerenciamento de pedidos com status
- Design responsivo para mobile e desktop

## Estrutura do Projeto
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express + PostgreSQL + Drizzle ORM
- **Autenticação Admin**: Senha hardcoded "admin123" (temporário)

## Pagamentos
Sistema preparado para integração futura com Stripe. Atualmente, pedidos são registrados sem processamento de pagamento real.

## Nota sobre Stripe
Usuário dispensou a integração do Stripe durante setup inicial. Para adicionar pagamentos reais no futuro:
1. Configure a integração Stripe via Replit Integrations
2. Implemente webhook de confirmação de pagamento
3. Atualize o checkout para processar pagamentos reais

## Status
✅ MVP funcional com dados de exemplo
✅ Todas as operações CRUD implementadas
✅ Frontend gerado e funcional
