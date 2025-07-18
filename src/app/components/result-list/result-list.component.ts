import { Component, Input } from '@angular/core';
import { Flight } from '../../interfaces/flight';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, DatePipe],
  template: `
    <div class="container-flights">
      <div *ngIf="showResults">
        <div *ngFor="let flight of flights" class="flight">
          <div *ngFor="let segment of flight.segments" class="flight-segment">
            <div class="flight-header">
              <h3>{{ segment.fromCity }} → {{ segment.toCity }}</h3>
              <span class="duration">{{ segment.duration | date:'H:mm' }} hours</span>
              <span *ngIf="segment.hasStop" class="stop-info">
                (Stop: {{ segment.stopDuration }})
              </span>
            </div>
            <div class="flight-details">
              <div class="departure">
                <span class="time">{{ segment.departureTime | date:'HH:mm' }}</span>
                <span class="date">{{ segment.departureTime | date:'dd.MM.yyyy' }}</span>
                <span class="city">{{ segment.fromCity }}</span>
              </div>
              <div class="route">
                <button mat-button (click)="toggleRoute(flight.id)" class="route-button">
                  <mat-icon>route</mat-icon>
                  Route
                </button>
                <div *ngIf="showFullRoute[flight.id]" class="full-route">
                  <div *ngFor="let city of flight.route.cities; let i = index" class="route-city">
                    <span *ngIf="i > 0" class="route-arrow">→</span>
                    <span class="city-name">{{ city.name }}</span>
                    <span *ngIf="city.isStop" class="stop-duration">(Stop: {{ city.stopDuration }})</span>
                  </div>
                </div>
              </div>
              <div class="arrival">
                <span class="time">{{ segment.arrivalTime | date:'HH:mm' }}</span>
                <span class="date">{{ segment.arrivalTime | date:'dd.MM.yyyy' }}</span>
                <span class="city">{{ segment.toCity }}</span>
              </div>
            </div>
          </div>
          <div class="train-info">
            <span class="train-name">Train: {{ flight.train.name }}</span>
          </div>
          <div class="carriages" (click)="openFlightDetails(flight.id)">
            <div *ngFor="let carriage of flight.train.carriages" class="carriage">
              <span class="type">{{ carriage.name }}</span>
              <span class="comfort">Class: {{ carriage.classComfort }}</span>
              <span class="seats">Available: {{ carriage.availableSeats }}/{{ carriage.allSeats }}</span>
              <span class="price">{{ carriage.price }} RUB</span>
            </div>
          </div>
        </div>
        <div *ngIf="!flights || flights.length === 0" class="no-flights">
          Рейсов не найдено
        </div>
      </div>
    </div>
  `,
  styleUrl: './result-list.component.scss'
})
export class ResultListComponent {
  @Input() flights: Flight[] | null = null;
  @Input() showResults: boolean = false;

  showFullRoute: {[key: number]: boolean} = {};

  constructor(private router: Router) {}

  toggleRoute(flightId: number) {
    this.showFullRoute[flightId] = !this.showFullRoute[flightId];
  }

  openFlightDetails(flightId: number) {
    this.router.navigate(['flight-details', flightId]);
  }
}