## Packages
react-hot-toast | Toast notifications for cart and checkout actions
@stripe/stripe-js | Future Stripe payment integration
@stripe/react-stripe-js | Future Stripe React components

## Notes
- Admin dashboard uses hardcoded password "admin123" - no backend auth required
- Checkout creates orders without payment processing (message: "Pagamento será processado posteriormente")
- System ready for future Stripe integration
- Use decimal strings for prices (e.g., "99.90") matching backend decimal type
- Category filtering on services page: Cabelo, Unhas, Estética, Massagem, etc.
