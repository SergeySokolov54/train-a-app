import { Injectable } from '@angular/core';
import { Flight } from '../../interfaces/flight';
import { Carriage } from '../../interfaces/carriage';
import { FlightSegment } from '../../interfaces/flight-segment';
import { CityStop } from '../../interfaces/city-stop';
import { TrainService } from '../train/train.service';
import { RouteService } from '../route/route.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  flights: Flight[];
  constructor(public trainService: TrainService, public routeService: RouteService) {
    this.flights = [
      // Нижний Новгород -> Москва (прямой)
      {
        id: 1,
        route: this.routeService.routes[0],
        train: this.trainService.trains[0],
        baseDepartureDate: new Date('2025-07-31T08:00:00'),
        baseArrivalDate: new Date('2025-07-31T11:30:00'),
        totalDuration: new Date('1970-01-01T03:30:00'),
        segments: [
          {
            fromCity: "Нижний Новгород",
            toCity: "Москва",
            departureTime: new Date('2025-07-31T08:00:00'),
            arrivalTime: new Date('2025-07-31T11:30:00'),
            duration: new Date('1970-01-01T03:30:00'),
            hasStop: false
          }
        ]
      },
      // Москва -> Нижний Новгород (прямой)
      {
        id: 2,
        route: this.routeService.routes[1],
        train: this.trainService.trains[1],
        baseDepartureDate: new Date('2025-07-31T12:00:00'),
        baseArrivalDate: new Date('2025-07-31T15:30:00'),
        totalDuration: new Date('1970-01-01T03:30:00'),
        segments: [
          {
            fromCity: "Москва",
            toCity: "Нижний Новгород",
            departureTime: new Date('2025-07-31T12:00:00'),
            arrivalTime: new Date('2025-07-31T15:30:00'),
            duration: new Date('1970-01-01T03:30:00'),
            hasStop: false
          }
        ]
      },
      // Нижний Новгород -> Санкт-Петербург (с остановкой в Москве)
      {
        id: 3,
        route: this.routeService.routes[2],
        train: this.trainService.trains[0],
        baseDepartureDate: new Date('2025-07-31T08:00:00'),
        baseArrivalDate: new Date('2025-07-31T16:30:00'),
        totalDuration: new Date('1970-01-01T08:30:00'),
        segments: [
          {
            fromCity: "Нижний Новгород",
            toCity: "Москва",
            departureTime: new Date('2025-07-31T08:00:00'),
            arrivalTime: new Date('2025-07-31T11:30:00'),
            duration: new Date('1970-01-01T03:30:00'),
            hasStop: false
          },
          {
            fromCity: "Москва",
            toCity: "Санкт-Петербург",
            departureTime: new Date('2025-07-31T12:00:00'),
            arrivalTime: new Date('2025-07-31T16:30:00'),
            duration: new Date('1970-01-01T04:30:00'),
            hasStop: true,
            stopDuration: "30 мин"
          }
        ]
      },
      // Санкт-Петербург -> Нижний Новгород (с остановкой в Москве)
      {
        id: 4,
        route: this.routeService.routes[3],
        train: this.trainService.trains[1],
        baseDepartureDate: new Date('2025-07-31T10:00:00'),
        baseArrivalDate: new Date('2025-07-31T18:30:00'),
        totalDuration: new Date('1970-01-01T08:30:00'),
        segments: [
          {
            fromCity: "Санкт-Петербург",
            toCity: "Москва",
            departureTime: new Date('2025-07-31T10:00:00'),
            arrivalTime: new Date('2025-07-31T14:30:00'),
            duration: new Date('1970-01-01T04:30:00'),
            hasStop: false
          },
          {
            fromCity: "Москва",
            toCity: "Нижний Новгород",
            departureTime: new Date('2025-07-31T15:00:00'),
            arrivalTime: new Date('2025-07-31T18:30:00'),
            duration: new Date('1970-01-01T03:30:00'),
            hasStop: true,
            stopDuration: "30 мин"
          }
        ]
      },
      // Москва -> Санкт-Петербург (прямой)
      {
        id: 5,
        route: this.routeService.routes[4],
        train: this.trainService.trains[0],
        baseDepartureDate: new Date('2025-07-31T14:00:00'),
        baseArrivalDate: new Date('2025-07-31T18:30:00'),
        totalDuration: new Date('1970-01-01T04:30:00'),
        segments: [
          {
            fromCity: "Москва",
            toCity: "Санкт-Петербург",
            departureTime: new Date('2025-07-31T14:00:00'),
            arrivalTime: new Date('2025-07-31T18:30:00'),
            duration: new Date('1970-01-01T04:30:00'),
            hasStop: false
          }
        ]
      },
      // Санкт-Петербург -> Москва (прямой)
      {
        id: 6,
        route: this.routeService.routes[5],
        train: this.trainService.trains[1],
        baseDepartureDate: new Date('2025-07-31T15:00:00'),
        baseArrivalDate: new Date('2025-07-31T19:30:00'),
        totalDuration: new Date('1970-01-01T04:30:00'),
        segments: [
          {
            fromCity: "Санкт-Петербург",
            toCity: "Москва",
            departureTime: new Date('2025-07-31T15:00:00'),
            arrivalTime: new Date('2025-07-31T19:30:00'),
            duration: new Date('1970-01-01T04:30:00'),
            hasStop: false
          }
        ]
      }
    ];
  }
  

  getFilteredFlights(date: Date | null, fromCity?: string | null, toCity?: string | null): Flight[] {
    if (!date) return [];

    const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const selectedDate = normalizeDate(date);

    return this.flights
      .filter(flight => normalizeDate(flight.baseDepartureDate).getTime() === selectedDate.getTime())
      .map(flight => {
        const fromIndex = fromCity 
          ? flight.route.cities.findIndex(c => c.name === fromCity)
          : 0;
        const toIndex = toCity
          ? flight.route.cities.findIndex(c => c.name === toCity)
          : flight.route.cities.length - 1;

        if (fromCity && toCity && (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex)) {
          return null;
        }

        const from = flight.route.cities[fromIndex];
        const to = flight.route.cities[toIndex];
        
        const segment: FlightSegment = {
          fromCity: from.name,
          toCity: to.name,
          departureTime: this.parseTimeOffset(flight.baseDepartureDate, from.timeOffset),
          arrivalTime: this.parseTimeOffset(flight.baseDepartureDate, to.timeOffset),
          duration: new Date(
            this.parseTimeOffset(flight.baseDepartureDate, to.timeOffset).getTime() - 
            this.parseTimeOffset(flight.baseDepartureDate, from.timeOffset).getTime()
          ),
          hasStop: toIndex - fromIndex > 1,
          stopDuration: this.calculateStopDuration(flight.route.cities, fromIndex, toIndex)
        };

        return {
          ...flight,
          segments: [segment]
        };
      })
      .filter(flight => flight !== null) as Flight[];
  }

  private parseTimeOffset(baseDate: Date, timeOffset: string): Date {
    const [hours, minutes] = timeOffset.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private calculateStopDuration(cities: CityStop[], fromIndex: number, toIndex: number): string {
    if (toIndex - fromIndex <= 1) return '';
    
    let totalMinutes = 0;
    for (let i = fromIndex + 1; i < toIndex; i++) {
      const duration = cities[i].stopDuration;
      if (duration) {
        const mins = parseInt(duration.match(/\d+/)?.[0] || '0');
        totalMinutes += mins;
      }
    }
    
    return totalMinutes > 0 ? `${totalMinutes} мин` : '';
  }

  getFlightById(id: number): Flight | undefined {
    return this.flights.find(flight => flight.id === id);
  }

  getCarriagesByFlightId(flightId: number): Carriage[] | undefined {
    const flight = this.getFlightById(flightId);
    return flight?.train.carriages;
  }
}