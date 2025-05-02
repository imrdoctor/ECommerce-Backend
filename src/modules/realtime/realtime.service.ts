import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { Server } from 'socket.io';

@Injectable()
export class RealtimeService {
  constructor(
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly gateway: RealtimeGateway,
  ) {}

  notifyPurchase(server: Server) {
    server.emit('purchase', { message: `Someone purchased` });
  }
}
