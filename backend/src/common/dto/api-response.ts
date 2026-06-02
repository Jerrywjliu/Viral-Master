/**
 * Generic API response wrapper for standardized responses.
 */
export class ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;

  constructor(code: number, data: T, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(200, data, message);
  }

  static created<T>(data: T, message: string = 'Created successfully'): ApiResponse<T> {
    return new ApiResponse<T>(201, data, message);
  }

  static error(code: number = 500, message: string = 'Internal server error', data: any = null): ApiResponse {
    return new ApiResponse(code, data, message);
  }

  static notFound(message: string = 'Resource not found'): ApiResponse {
    return new ApiResponse(404, null, message);
  }

  static badRequest(message: string = 'Bad request', data: any = null): ApiResponse {
    return new ApiResponse(400, data, message);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiResponse {
    return new ApiResponse(401, null, message);
  }

  static forbidden(message: string = 'Forbidden'): ApiResponse {
    return new ApiResponse(403, null, message);
  }
}

/**
 * Paginated response wrapper for list endpoints.
 */
export class PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;

  constructor(items: T[], total: number, page: number, pageSize: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }

  static from<T>(
    items: T[],
    total: number,
    page: number,
    pageSize: number,
  ): ApiResponse<PaginatedResponse<T>> {
    return ApiResponse.success(
      new PaginatedResponse<T>(items, total, page, pageSize),
    );
  }
}
