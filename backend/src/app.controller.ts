import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from './common/dto/api-response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiResponse<string> {
    return ApiResponse.success(this.appService.getHello());
  }

  @Get('health')
  healthCheck(): ApiResponse<{ status: string; timestamp: string }> {
    return ApiResponse.success({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
