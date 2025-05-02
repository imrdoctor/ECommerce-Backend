// src/realtime/realtime.gateway.ts
import {WebSocketGateway,WebSocketServer,OnGatewayConnection,OnGatewayDisconnect,} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
  @WebSocketGateway({cors: {origin: '*',},})
  export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    sendPurchaseNotification() {
      this.server.emit('purchase', { message: `Someone purchased ` });
    }
  }
  