import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { Credit } from '../entities/credit.entity';
import { CreditTransaction, TransactionType, TransactionStatus } from '../entities/credit-transaction.entity';

@Injectable()
export class CreditService {
  private readonly logger = new Logger(CreditService.name);
  
  // In-memory storage (to be replaced with database)
  private credits: Map<string, Credit> = new Map();
  private transactions: Map<string, CreditTransaction[]> = new Map();

  async getCredit(userId: string): Promise<Credit> {
    let credit = this.credits.get(userId);
    if (!credit) {
      // Create default credit account for user
      credit = new Credit({ userId });
      this.credits.set(userId, credit);
      this.transactions.set(userId, []);
    }
    return credit;
  }

  async deductCredits(
    userId: string,
    amount: number,
    description?: string,
    referenceType?: string,
    referenceId?: string,
  ): Promise<CreditTransaction> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const credit = await this.getCredit(userId);

    if (!credit.hasSufficientCredits(amount)) {
      throw new BadRequestException(
        `Insufficient credits. Available: ${credit.balance}, Required: ${amount}`,
      );
    }

    const balanceBefore = credit.balance;
    credit.deduct(amount);

    const transaction = new CreditTransaction({
      userId,
      type: TransactionType.SPEND,
      amount: -amount,
      balanceBefore,
      balanceAfter: credit.balance,
      status: TransactionStatus.COMPLETED,
      description,
      referenceType,
      referenceId,
    });

    this.addTransaction(userId, transaction);
    this.logger.log(`Credits deducted: ${amount} from user ${userId}. Balance: ${credit.balance}`);

    return transaction;
  }

  async addCredits(
    userId: string,
    amount: number,
    description?: string,
    referenceType?: string,
    referenceId?: string,
  ): Promise<CreditTransaction> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const credit = await this.getCredit(userId);
    const balanceBefore = credit.balance;
    credit.add(amount);

    const transaction = new CreditTransaction({
      userId,
      type: TransactionType.EARN,
      amount,
      balanceBefore,
      balanceAfter: credit.balance,
      status: TransactionStatus.COMPLETED,
      description,
      referenceType,
      referenceId,
    });

    this.addTransaction(userId, transaction);
    this.logger.log(`Credits added: ${amount} to user ${userId}. Balance: ${credit.balance}`);

    return transaction;
  }

  async getTransactions(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ items: CreditTransaction[]; total: number; page: number; pageSize: number }> {
    const userTransactions = this.transactions.get(userId) || [];
    const total = userTransactions.length;
    const start = (page - 1) * pageSize;
    const items = userTransactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(start, start + pageSize);

    return { items, total, page, pageSize };
  }

  private addTransaction(userId: string, transaction: CreditTransaction): void {
    const userTransactions = this.transactions.get(userId) || [];
    userTransactions.push(transaction);
    this.transactions.set(userId, userTransactions);
  }
}
