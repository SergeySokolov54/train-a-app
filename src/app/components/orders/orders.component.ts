import { Component } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Order } from '../../interfaces/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule
  ],
  template: `
    <div class="orders-container">
      <h2>Мои бронирования</h2>
      
      <div class="filter-controls">
        <mat-checkbox [(ngModel)]="activeOnly">Только активные бронирования</mat-checkbox>
      </div>
      
      <div *ngIf="filteredOrders.length === 0" class="no-orders">
        {{ activeOnly ? 'У вас нет активных бронирований' : 'У вас нет бронирований' }}
      </div>
      
      <div *ngFor="let order of getReversedOrders(filteredOrders)" class="order-card">
        <!-- Заголовок с маршрутом -->
        <h3>Рейс: {{ getOrderRoute(order) }}</h3>
        
        <div class="order-details">
          <!-- Информация о поезде -->
          <div class="train-info" *ngIf="order.flight?.train as train">
            <p><strong>Поезд:</strong> {{ train.name || 'Не указан' }}</p>
            <p><strong>Количество вагонов:</strong> {{ train.carriages.length || 0 }}</p>
          </div>

          <!-- Даты поездки -->
          <div class="date-info" *ngIf="order.flight?.segments as segments">
            <p *ngIf="segments[0]?.departureTime as departureTime">
              <strong>Отправление:</strong> {{ departureTime | date:'medium' }}
            </p>
            <p *ngIf="segments[segments.length - 1]?.arrivalTime as arrivalTime">
              <strong>Прибытие:</strong> {{ arrivalTime | date:'medium' }}
            </p>
          </div>

          <!-- Информация о бронировании -->
          <div class="booking-info">
            <p><strong>Ваш вагон:</strong> {{ order.numberCarriage || '—' }}</p>
            <p><strong>Ваше место:</strong> {{ order.numberSeat || '—' }}</p>
            <p><strong>Стоимость:</strong> {{ order.price }}</p>
            <p>
              <strong>Статус:</strong>
              <span [class.active]="order.isActive" [class.inactive]="!order.isActive">
                {{ order.isActive ? 'Активно' : 'Неактивно' }}
              </span>
            </p>
          </div>

          <!-- Детали маршрута -->
          <div class="route-details" *ngIf="order.flight?.segments as segments">
            <h4>Маршрут следования:</h4>
            <div class="segments-container">
              <div *ngFor="let segment of segments" class="segment">
                <div class="segment-route">
                  <span class="city">{{ segment.fromCity || 'Не указан' }}</span>
                  <span class="arrow">→</span>
                  <span class="city">{{ segment.toCity || 'Не указан' }}</span>
                </div>
                <div class="segment-times" *ngIf="segment.departureTime && segment.arrivalTime">
                  <span>{{ segment.departureTime | date:'shortTime' }}</span>
                  <span> - </span>
                  <span>{{ segment.arrivalTime | date:'shortTime' }}</span>
                </div>
                <div class="segment-stop" *ngIf="segment.hasStop">
                  Остановка: {{ segment.stopDuration || '—' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Кнопка отмены -->
        <div class="actions" *ngIf="order.isActive">
          <button mat-raised-button 
                  color="warn" 
                  (click)="cancelOrder(order.id)"
                  class="cancel-button">
            Отменить бронь
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  orders: Order[] = [];
  activeOnly: boolean = true;

  constructor(private orderService: OrderService) {
    this.loadOrders();
  }

  get filteredOrders(): Order[] {
    return this.activeOnly 
      ? this.orders.filter(order => order.isActive)
      : this.orders;
  }

  loadOrders(): void {
    this.orders = this.orderService.getOrders();
  }

  getReversedOrders(orders: Order[]): Order[] {
    return [...orders].reverse();
  }

  cancelOrder(orderId: number): void {
    if (confirm('Вы уверены, что хотите отменить это бронирование?')) {
      this.orderService.cancelOrder(orderId);
      this.loadOrders(); // Обновляем список
    }
  }

  getOrderRoute(order: Order): string {
    // Проверяем наличие сегментов полета
    if (order.flight.segments && order.flight.segments.length > 0) {
      const firstSegment = order.flight.segments[0];
      const lastSegment = order.flight.segments[order.flight.segments.length - 1];
      
      // Для маршрута с одним сегментом
      if (order.flight.segments.length === 1) {
        return `${firstSegment.fromCity} → ${firstSegment.toCity}`;
      }
      
      // Для маршрута с несколькими сегментами
      return `${firstSegment.fromCity} → ${lastSegment.toCity}`;
    }
    
    // Если сегментов нет, пытаемся использовать cities из route
    if (order.flight.route?.cities && order.flight.route.cities.length > 0) {
      const firstCity = order.flight.route.cities[0];
      const lastCity = order.flight.route.cities[order.flight.route.cities.length - 1];
      return `${firstCity.name} → ${lastCity.name}`;
    }
    
    // Если ничего не найдено
    return 'Неизвестный маршрут';
  }
}