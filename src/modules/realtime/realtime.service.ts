// src/realtime/realtime.service.ts
import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { Server } from 'socket.io';

@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  notifyPurchase(server: Server) {
    server.emit('purchase', { message: `Someone purchased` });
  }
}
