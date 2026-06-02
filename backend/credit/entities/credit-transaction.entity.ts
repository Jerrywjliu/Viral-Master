import { v4 as uuidv4 } from 'uuid';

export enum TransactionType {
  EARN = 'earn',
  SPEND = 'spend',
  REFUND = 'refund',
  EXPIRED = 'expired',
  ADMIN_ADJUST = 'admin_adjust',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export class CreditTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;

  constructor(partial: Partial<CreditTransaction>) {
    this.id = partial.id || uuidv4();
    this.userId = partial.userId || '';
    this.type = partial.type || TransactionType.EARN;
    this.amount = partial.amount || 0;
    this.balanceBefore = partial.balanceBefore || 0;
    this.balanceAfter = partial.balanceAfter || 0;
    this.status = partial.status || TransactionStatus.PENDING;
    this.description = partial.description;
    this.referenceType = partial.referenceType;
    this.referenceId = partial.referenceId;
    this.metadata = partial.metadata || {};
    this.createdAt = partial.createdAt || new Date();
  }
}
