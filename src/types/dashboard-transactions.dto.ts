export enum TransactionType {
  SALE = "Sale",
  DONATION = "Donation",
}

export enum TransactionStatus {
  INTERESTED = 'Interested',                 // Comprador mostró interés, esperando aceptación del vendedor
  INTEREST_CANCELLED = 'InterestCancelled',  // Comprador canceló interés antes de que el vendedor aceptara/rechazara
  IN_PROGRESS = 'InProgress',                // La transacción está en curso (vendedor y comprador en proceso)
  TRANSACTION_CANCELLED = 'TransactionCancelled', // Cancelación de transacción en curso (IN_PROGRESS), comprador o vendedor decide cancelar

  SOLD_OUT_TOTAL = 'SoldOutTotal',           // No se puede completar por agotamiento total del producto
  SOLD_OUT_PARTIAL = 'SoldOutPartial',       // La cantidad solicitada no se puede completar completamente, queda stock parcial
  NOTIFY_AVAILABLE_ANY = 'NotifyAvailableAny',   // Comprador decidió esperar a ser notificado cuando haya cualquier cantidad disponible
  NOTIFY_AVAILABLE_FULL = 'NotifyAvailableFull', // Comprador decidió esperar a ser notificado cuando haya la cantidad completa que necesita o más

  DELIVERED = 'Delivered',                   // Producto entregado por el vendedor
  COMPLETED = 'Completed',                   // Entrega confirmada por comprador
}


// DTO para usar en el front
export interface DashboardTransactionsDto{
  id: string;
  product: string;
  seller: string;   // nombre del vendedor
  buyer: string;    // nombre del comprador
  status: TransactionStatus;
  type: TransactionType;
  totalPrice: number;
  quantityRequested: number;
  date: string;
}