import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Injectable } from '@nestjs/common';
import { RealtimeService } from './realtime.service';

  @WebSocketGateway({ cors: { origin: '*' } })
  @Injectable()
  export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly realtimeService: RealtimeService) {}   
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    emitPurchase() {
        this.realtimeService.notifyPurchase(this.server);
    }
  }
  