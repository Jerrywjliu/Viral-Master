// Credit System Contracts

interface CreditBalance {
  userId: string
  balance: number
}

interface CreditCostEstimate {
  modelVersion: string
  duration: number
  quantity: number
  resolution: string
  totalCost: number    // estimated credits
}

interface CreditTransaction {
  id: string
  type: 'deduct' | 'recharge' | 'refund'
  amount: number       // positive = credit, negative = debit
  refType?: string
  refId?: string
  createdAt: string
}

interface CreditTransactionListResponse {
  items: CreditTransaction[]
  total: number
  page: number
  pageSize: number
}

// APIs
// GET  /api/v1/viral-master/credit/balance          → CreditBalance
// POST /api/v1/viral-master/credit/estimate         → CreditCostEstimate
// GET  /api/v1/viral-master/credit/transactions     → CreditTransactionListResponse
