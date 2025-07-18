import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Flight } from './app/interfaces/flight';
import { Carriage } from './app/interfaces/carriage';
import { Route } from './app/interfaces/route';
import { Train } from './app/interfaces/train';
import { Order } from './app/interfaces/order';
import { AuthorizedUser } from './app/interfaces/authorized-user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbPath = '/assets/db.json';
  private dbData: any;

  constructor(private http: HttpClient) {}

  loadDatabase(): Observable<any> {
    if (this.dbData) {
      return of(this.dbData);
    }
    return this.http.get(this.dbPath).pipe(
      map(data => {
        this.dbData = data;
        return data;
      })
    );
  }

  // Методы для получения данных
  getFlights(): Observable<Flight[]> {
    return this.loadDatabase().pipe(
      map(data => data.flights.map((flight: any) => ({
        ...flight,
        baseDepartureDate: new Date(flight.baseDepartureDate),
        baseArrivalDate: new Date(flight.baseArrivalDate),
        totalDuration: new Date(flight.totalDuration),
        segments: flight.segments.map((segment: any) => ({
          ...segment,
          departureTime: new Date(segment.departureTime),
          arrivalTime: new Date(segment.arrivalTime),
          duration: new Date(segment.duration)
        }))
      })))
    );
  }

  getTrains(): Observable<Train[]> {
    return this.loadDatabase().pipe(map(data => data.trains));
  }

  getRoutes(): Observable<Route[]> {
    return this.loadDatabase().pipe(map(data => data.routes));
  }

  getUsers(): Observable<AuthorizedUser[]> {
    return this.loadDatabase().pipe(map(data => data.users || []));
  }

  getBookedSeats(): Observable<{[flightId: number]: {carriageId: number, seatNumber: number, userId: string}[]}> {
    return this.loadDatabase().pipe(map(data => data.bookedSeats || {}));
  }

  // Методы для обновления данных
  updateUsers(users: AuthorizedUser[]): Observable<void> {
    this.dbData.users = users;
    return this.saveDatabase();
  }

  updateBookedSeats(bookedSeats: {[flightId: number]: {carriageId: number, seatNumber: number, userId: string}[]}): Observable<void> {
    this.dbData.bookedSeats = bookedSeats;
    return this.saveDatabase();
  }

  private saveDatabase(): Observable<void> {
    // В реальном приложении здесь должен быть HTTP-запрос для сохранения на сервере
    // Для демонстрации просто сохраняем в localStorage
    localStorage.setItem('db', JSON.stringify(this.dbData));
    return of();
  }
}