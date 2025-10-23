import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { databaseConfig } from '../config/database.config';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig)],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class CoreModule {}
