import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViralMasterModule } from './viral-master/viral-master.module';
import { CreditModule } from '../credit/credit.module';

@Module({
  imports: [
    ViralMasterModule,
    CreditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
