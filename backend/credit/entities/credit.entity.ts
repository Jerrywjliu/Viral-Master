import { v4 as uuidv4 } from 'uuid';

export class Credit {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  tier: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Credit>) {
    this.id = partial.id || uuidv4();
    this.userId = partial.userId || '';
    this.balance = partial.balance || 0;
    this.totalEarned = partial.totalEarned || 0;
    this.totalSpent = partial.totalSpent || 0;
    this.tier = partial.tier || 'free';
    this.expiresAt = partial.expiresAt;
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }

  /**
   * Check if user has sufficient credits for a transaction.
   */
  hasSufficientCredits(amount: number): boolean {
    return this.balance >= amount;
  }

  /**
   * Deduct credits from the balance.
   */
  deduct(amount: number): void {
    if (!this.hasSufficientCredits(amount)) {
      throw new Error(`Insufficient credits. Available: ${this.balance}, Required: ${amount}`);
    }
    this.balance -= amount;
    this.totalSpent += amount;
    this.updatedAt = new Date();
  }

  /**
   * Add credits to the balance.
   */
  add(amount: number): void {
    this.balance += amount;
    this.totalEarned += amount;
    this.updatedAt = new Date();
  }
}
