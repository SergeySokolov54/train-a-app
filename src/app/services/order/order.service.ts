import { Injectable } from '@angular/core';
import { Order } from '../../interfaces/order';
import { Flight } from '../../interfaces/flight';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private userService: UserService) {}

  createOrder(flight: Flight, numberSeat: number, numberCarriage: string, price: string): Order {
    const currentUser = this.userService.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Находим carriageId по номеру вагона
    const carriage = flight.train.carriages.find(
      c => `№${c.id - 200}` === numberCarriage // предполагаем формат "№X"
    );
    
    if (!carriage) {
      throw new Error('Carriage not found');
    }

    // Добавляем информацию о бронировании
    this.userService.addBookedSeat(flight.id, carriage.id, numberSeat, currentUser.email);

    const newOrder: Order = {
      id: this.generateId(),
      userId: currentUser.email,
      flight,
      numberSeat,
      numberCarriage,
      price,
      isActive: true
    };
    
    this.userService.addOrderToUser(newOrder);
    return newOrder;
  }

  getOrders(): Order[] {
    return this.userService.getUserOrders();
  }

  getActiveOrders(): Order[] {
    return this.getOrders().filter(order => order.isActive);
  }

  getBookedSeats(flightId: number): {carriageId: number, seatNumber: number}[] {
    return this.userService.getBookedSeats(flightId);
  }

  private generateId(): number {
    const orders = this.userService.getUserOrders();
    return orders.length > 0 
      ? Math.max(...orders.map(o => o.id)) + 1 
      : 1;
  }

  cancelOrder(orderId: number): void {
    const order = this.userService.getUserOrders().find(o => o.id === orderId);
    if (order) {
      // Находим carriageId по номеру вагона
      const carriage = order.flight.train.carriages.find(
        c => `№${c.id - 200}` === order.numberCarriage
      );
      
      if (carriage) {
        this.userService.removeBookedSeat(order.flight.id, carriage.id, order.numberSeat);
      }
      
      this.userService.cancelUserOrder(orderId);
    }
  }
}