export interface RejectInterestDto {
  buyerId: string;           // ID del comprador
  transactionId: string;     // ID de la transacción
  rejectedReason: string;    // Motivo del rechazo
}
