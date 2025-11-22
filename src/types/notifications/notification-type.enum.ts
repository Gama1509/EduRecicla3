export enum NotificationType {
  // Revisiones de productos por admin
  PRODUCT_ACCEPTED = 'product_accepted',       // Admin aceptó el producto
  PRODUCT_REJECTED = 'product_rejected',       // Admin rechazó el producto

  // Flujo de interés en producto
  INTEREST_MARKED = 'interest_marked',         // Comprador marcó interés → notificación al vendedor
  INTEREST_ACCEPTED = 'interest_accepted',     // Vendedor aceptó interés → notificación al comprador
  INTEREST_REJECTED = 'interest_rejected',     // Vendedor rechazó interés → notificación al comprador
  INTEREST_CANCELLED = 'interest_cancelled',   // Comprador canceló interés → notificación al vendedor
  // Comentario: si se rechazó, el comprador no podrá volver a solicitar en 15 días.

  // Transacciones en curso
  SELLER_CANCELLED_TRANSACTION = 'seller_cancelled_transaction', // Vendedor canceló una transacción en curso (IN_PROGRESS)
  BUYER_CANCELLED_TRANSACTION = 'buyer_cancelled_transaction',   // Comprador canceló una transacción en curso (IN_PROGRESS)
  DELIVERY_MARKED = 'delivery_marked',              // Vendedor marcó entrega → notificación al comprador
  COMPLETION_CONFIRMED_SELLER = 'completion_confirmed_seller', // Notificación al vendedor
  COMPLETION_CONFIRMED_BUYER = 'completion_confirmed_buyer',

  // Stock agotado o parcial
  SOLD_OUT_TOTAL = 'sold_out_total',               // Se ha agotado totalmente el producto
  SOLD_OUT_PARTIAL = 'sold_out_partial',           // Solo queda menos de lo solicitado (sin sanción)

  // Notificación de stock disponible al comprador
  NOTIFY_AVAILABLE_ANY = 'notify_available_any',   // Notificar cuando haya cualquier cantidad disponible
  NOTIFY_AVAILABLE_FULL = 'notify_available_full', // Notificar cuando haya la cantidad completa requerida o más

  // Notificación al vendedor sobre decisiones de espera del comprador
  BUYER_WAIT_ANY = 'buyer_wait_any',               // Comprador decidió esperar cuando haya **cualquier cantidad** → notificación al vendedor
  BUYER_WAIT_FULL = 'buyer_wait_full',             // Comprador decidió esperar hasta que haya **la cantidad completa** → notificación al vendedor
}