import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';

@Module({
  controllers: [],
  providers: [RealtimeGateway,RealtimeService],
  exports: [RealtimeGateway,RealtimeService],
})
export class RealtimeModule {}