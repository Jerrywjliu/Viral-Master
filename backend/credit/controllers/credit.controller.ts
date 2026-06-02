import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CreditService } from '../services/credit.service';
import { Credit } from '../entities/credit.entity';
import { CreditTransaction } from '../entities/credit-transaction.entity';
import { ApiResponse, PaginatedResponse } from '../../src/common/dto/api-response';

@Controller('credits')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Get(':userId')
  async getCredit(@Param('userId') userId: string): Promise<ApiResponse<Credit>> {
    const credit = await this.creditService.getCredit(userId);
    return ApiResponse.success(credit);
  }

  @Post(':userId/deduct')
  async deductCredits(
    @Param('userId') userId: string,
    @Body() body: { amount: number; description?: string; referenceType?: string; referenceId?: string },
  ): Promise<ApiResponse<CreditTransaction>> {
    const transaction = await this.creditService.deductCredits(
      userId,
      body.amount,
      body.description,
      body.referenceType,
      body.referenceId,
    );
    return ApiResponse.success(transaction, 'Credits deducted');
  }

  @Post(':userId/add')
  async addCredits(
    @Param('userId') userId: string,
    @Body() body: { amount: number; description?: string; referenceType?: string; referenceId?: string },
  ): Promise<ApiResponse<CreditTransaction>> {
    const transaction = await this.creditService.addCredits(
      userId,
      body.amount,
      body.description,
      body.referenceType,
      body.referenceId,
    );
    return ApiResponse.success(transaction, 'Credits added');
  }

  @Get(':userId/transactions')
  async getTransactions(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<CreditTransaction>>> {
    const result = await this.creditService.getTransactions(userId, page, pageSize);
    return PaginatedResponse.from(result.items, result.total, result.page, result.pageSize);
  }
}
