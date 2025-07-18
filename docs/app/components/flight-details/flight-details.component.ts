import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../services/flight/flight.service';
import { CommonModule } from '@angular/common';
import { Carriage } from '../../interfaces/carriage';
import { Subscription } from 'rxjs';
import { FilterService } from '../../services/filter/filter.service';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { FlightSegment } from '../../interfaces/flight-segment';
import { Flight } from '../../interfaces/flight';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="flight">
      <div *ngIf="flight.train?.carriages?.length" class="main-container">
        <div class="carriages-section">
          <h3 class="route-title">
            {{ getRouteTitle() }}
          </h3>
          
          <!-- Вкладки классов комфорта -->
          <div class="comfort-class-tabs">
            <button 
              *ngFor="let comfortClass of getSortedComfortClasses()" 
              class="tab-button"
              [class.active]="activeTab === comfortClass"
              (click)="setActiveTab(comfortClass)">
              {{ comfortClass }} класс комфорта
            </button>
          </div>
          
          <!-- Контент для активной вкладки -->
          <div *ngFor="let carriageType of getCarriageTypes()">
            <div *ngIf="hasCarriagesForTypeAndComfort(carriageType, activeTab)" class="carriage-type-group">
              <h4>{{ carriageType }}</h4>
              
              <div class="carriages-container">
                <div *ngFor="let carriage of getCarriagesByTypeAndComfort(carriageType, activeTab)" class="carriage-card">
                
                <div class="carriage-title">
                  <h5>Вагон №{{ carriage.id - 200}}</h5>
                  <div class="available-seats-container">
                    <p class="available-seats">{{ carriage.availableSeats }} мест</p>
                  </div>
                </div>
                <p>Класс комфорта: {{ carriage.classComfort }}</p>
                
                <div class="seats-container">
                  <!-- Первая строка -->
                  <div class="seats-row">
                    <div *ngFor="let seat of getRowSeats(carriage.allSeats, 1)" 
                        class="seat"
                        [class.available]="isSeatAvailable(seat, carriage)"
                        [class.selected]="isSeatSelected(seat, carriage)"
                        (click)="toggleSeatSelection(seat, carriage)">
                      {{ seat }}
                    </div>
                  </div>

                  <!-- Вторая строка -->
                  <div class="seats-row">
                    <div *ngFor="let seat of getRowSeats(carriage.allSeats, 2)" 
                        class="seat"
                        [class.available]="isSeatAvailable(seat, carriage)"
                        [class.selected]="isSeatSelected(seat, carriage)"
                        (click)="toggleSeatSelection(seat, carriage)">
                      {{ seat }}
                    </div>
                  </div>
                  
                  <!-- Проход -->
                  <div class="aisle"></div>
                  
                  <!-- Третья строка -->
                  <div class="seats-row">
                    <div *ngFor="let seat of getRowSeats(carriage.allSeats, 3)" 
                        class="seat"
                        [class.available]="isSeatAvailable(seat, carriage)"
                        [class.selected]="isSeatSelected(seat, carriage)"
                        (click)="toggleSeatSelection(seat, carriage)">
                      {{ seat }}
                    </div>
                  </div>
                </div>
                <p class="price">Цена: {{ carriage.price }} RUB</p>
              </div>
            </div>
          </div>
        </div>
        <div class="info-seat-container">
          <div class="info-item">
            <div class="seat">

            </div>
            <span class="info-place">Занятое место</span>
          </div>

          <div class="info-item">
            <div class="seat available">
              
            </div>
            <span class="info-place">Свободное место</span>
          </div>
          <div class="info-item">
            <div class="seat selected">
              
            </div>
            <span class="info-place">Зарезервированное место</span>
          </div>
        </div>
        <div class="booking-form" *ngIf="selectedSeat">
          <div class="form-container">
            <h3>Ваше бронирование</h3>
            
            <div class="booking-info">
              <div class="info-row">
                <span>Вагон:</span>
                <strong>№{{ getSelectedCarriageNumber() }}</strong>
              </div>
              
              <div class="info-row">
                <span>Место:</span>
                <strong>{{ selectedSeat.seatNumber }}</strong>
              </div>
              
              <div class="info-row">
                <span>Класс:</span>
                <strong>{{ getSelectedComfortClass() }}</strong>
              </div>
              
              <div class="info-row price">
                <span>Цена:</span>
                <strong>{{ getSelectedPrice() }} RUB</strong>
              </div>
            </div>
            
            <button class="book-button" (click)="bookSeat()">
              Забронировать место
            </button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!flight" class="loading">
      Загрузка данных о рейсе...
    </div>
  `,
  styleUrl: './flight-details.component.scss'
})
export class FlightDetailsComponent implements OnInit {
  flight: any;
  selectedSeat: {carriageId: number, seatNumber: number} | null = null;
  occupiedSeatsMap: {[carriageId: number]: number[]} = {};
  searchParams: {from: string, to: string, date: Date | null} | null = null;
  activeTab: string = '1'; // Текущая активная вкладка
  private searchParamsSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private filterService: FilterService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const flightId = this.route.snapshot.paramMap.get('id');
  
    this.searchParamsSubscription = this.filterService.searchParams$.subscribe(
      params => {
        this.searchParams = params;
      }
    );

    if (flightId) {
      this.flight = this.flightService.getFlightById(+flightId);
      this.initializeBookedSeats();
      
      // Добавляем забронированные места из OrderService
      this.addBookedSeatsToOccupied(+flightId);
      
      const classes = this.getSortedComfortClasses();
      if (classes.length > 0 && !classes.includes(this.activeTab)) {
        this.activeTab = classes[0];
      }
    }
  }

  ngOnDestroy(): void {
    if (this.searchParamsSubscription) {
      this.searchParamsSubscription.unsubscribe();
    }
  }

  getSortedComfortClasses(): string[] {
    if (!this.flight?.train?.carriages) return [];
    
    // Получаем все уникальные классы комфорта
    const classes = new Set<string>();
    this.flight.train.carriages.forEach((c: Carriage) => {
      classes.add(c.classComfort.toString());
    });
    
    // Сортируем их как числа
    return Array.from(classes).sort((a, b) => {
      return parseInt(a, 10) - parseInt(b, 10);
    });
  }

  // Проверяем, есть ли вагоны данного типа для активного класса комфорта
  hasCarriagesForTypeAndComfort(type: string, comfortClass: string): boolean {
    const carriages = this.flight?.train?.carriages?.filter((c: Carriage) => 
      c.name === type && c.classComfort.toString() === comfortClass
    );
    return carriages && carriages.length > 0;
  }

  // Получаем вагоны по типу и классу комфорта (с числовым сравнением)
  getCarriagesByTypeAndComfort(type: string, comfortClass: string): Carriage[] {
    if (!this.flight?.train?.carriages) return [];
    
    return this.flight.train.carriages.filter((c: Carriage) => {
      return c.name === type && c.classComfort.toString() === comfortClass;
    });
  }
// Получаем уникальные классы комфорта в виде строк
  getComfortClasses(): string[] {
    if (!this.flight?.train?.carriages) return [];
    const classes = new Set<string>();
    this.flight.train.carriages.forEach((c: Carriage) => {
      // Преобразуем classComfort к строке, если он число
      const comfortClass = typeof c.classComfort === 'number' 
        ? c.classComfort.toString() 
        : c.classComfort;
      classes.add(comfortClass);
    });
    return Array.from(classes);
  }

  // Устанавливаем активную вкладку
  setActiveTab(comfortClass: string): void {
    this.activeTab = comfortClass;
  }

  getRouteTitle(): string {
    if (this.searchParams) {
      const departureDate = this.flight?.segments[0]?.departureTime;
      const formattedDate = this.formatDate(departureDate);
      return `${this.searchParams.from} → ${this.searchParams.to} ${formattedDate}`;
    }
    return this.getDefaultRouteTitle();
  }

  private getDefaultRouteTitle(): string {
    if (!this.flight?.segments?.length) return '';
    
    const firstSegment = this.flight.segments[0];
    const lastSegment = this.flight.segments[this.flight.segments.length - 1];
    const departureDate = firstSegment.departureTime;
    const formattedDate = this.formatDate(departureDate);
    
    return `${firstSegment.fromCity} → ${lastSegment.toCity} ${formattedDate}`;
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('ru-RU', options);
  }

  getRowSeats(totalSeats: number, rowNumber: number, rowsCount: number = 3): number[] {
    const seats = this.generateSeats(totalSeats);
    const seatsPerRow = Math.ceil(seats.length / rowsCount);
    const result: number[] = [];
    
    for (let col = 0; col < seatsPerRow; col++) {
      const seatIndex = col * rowsCount + (rowNumber - 1);
      if (seatIndex < seats.length) {
        result.push(seats[seatIndex]);
      }
    }
    
    return result;
  }

  getCarriageTypes(): string[] {
    if (!this.flight?.train?.carriages) return [];
    const types = new Set<string>();
    this.flight.train.carriages.forEach((c: Carriage) => types.add(c.name));
    return Array.from(types);
  }

  generateSeats(totalSeats: number): number[] {
    return Array.from({length: totalSeats}, (_, i) => i + 1);
  }

  isSeatAvailable(seatNumber: number, carriage: Carriage): boolean {
    // Проверяем, не занято ли место глобально
    const isGloballyBooked = this.userService.getBookedSeatsForCarriage(this.flight.id, carriage.id).includes(seatNumber);
    // Проверяем, не занято ли место локально (в текущей сессии)
    const isLocallyOccupied = this.occupiedSeatsMap[carriage.id]?.includes(seatNumber) || false;
    
    return !isGloballyBooked && !isLocallyOccupied;
  }

  isSeatSelected(seatNumber: number, carriage: Carriage): boolean {
    return this.selectedSeat?.carriageId === carriage.id && 
           this.selectedSeat?.seatNumber === seatNumber;
  }

  toggleSeatSelection(seatNumber: number, carriage: Carriage): void {
    if (!this.isSeatAvailable(seatNumber, carriage)) return;

    if (this.isSeatSelected(seatNumber, carriage)) {
      this.selectedSeat = null;
    } else {
      this.selectedSeat = {
        carriageId: carriage.id,
        seatNumber: seatNumber
      };
    }
  }

  // Новые методы для формы
  getSelectedCarriageNumber(): number {
    if (!this.selectedSeat) return 0;
    return this.selectedSeat.carriageId - 200; // или другая логика нумерации
  }

  getSelectedComfortClass(): string {
    if (!this.selectedSeat) return '';
    const carriage = this.flight.train.carriages.find(
      (c: Carriage) => c.id === this.selectedSeat?.carriageId
    );
    return carriage?.classComfort + ' класс' || '';
  }

  getSelectedPrice(): number {
    if (!this.selectedSeat) return 0;
    const carriage = this.flight.train.carriages.find(
      (c: Carriage) => c.id === this.selectedSeat?.carriageId
    );
    return carriage?.price || 0;
  }

  private addBookedSeatsToOccupied(flightId: number): void {
    const bookedSeats = this.orderService.getBookedSeats(flightId);
    
    bookedSeats.forEach(booked => {
      if (!this.occupiedSeatsMap[booked.carriageId]) {
        this.occupiedSeatsMap[booked.carriageId] = [];
      }
      
      if (!this.occupiedSeatsMap[booked.carriageId].includes(booked.seatNumber)) {
        this.occupiedSeatsMap[booked.carriageId].push(booked.seatNumber);
        
        // Обновляем availableSeats в вагоне
        const carriage = this.flight?.train?.carriages.find(
          (c: Carriage) => c.id === booked.carriageId
        );
        if (carriage) {
          carriage.availableSeats--;
        }
      }
    });
  }
  

  private initializeBookedSeats(): void {
    if (!this.flight?.id) return;
    
    this.occupiedSeatsMap = {};
    
    // Получаем забронированные места для этого рейса
    const bookedSeats = this.userService.getBookedSeats(this.flight.id);
    
    // Заполняем occupiedSeatsMap
    bookedSeats.forEach(booked => {
      if (!this.occupiedSeatsMap[booked.carriageId]) {
        this.occupiedSeatsMap[booked.carriageId] = [];
      }
      if (!this.occupiedSeatsMap[booked.carriageId].includes(booked.seatNumber)) {
        this.occupiedSeatsMap[booked.carriageId].push(booked.seatNumber);
      }
    });
    
    // Обновляем availableSeats для каждого вагона
    if (this.flight?.train?.carriages) {
      this.flight.train.carriages.forEach((carriage: Carriage) => {
        const bookedInCarriage = this.userService.getBookedSeatsForCarriage(this.flight.id, carriage.id).length;
        carriage.availableSeats = carriage.allSeats - bookedInCarriage;
      });
    }
  }


  bookSeat(): void {
    if (!this.userService.currentUser) {
      alert('Для бронирования места необходимо авторизоваться. Пожалуйста, войдите в систему или зарегистрируйтесь.');
      return; // Прерываем выполнение метода
    }

    if (!this.selectedSeat || !this.flight || !this.searchParams) return;

    const carriage = this.flight.train.carriages.find(
      (c: Carriage) => c.id === this.selectedSeat?.carriageId
    );
    
    if (!carriage) return;

    // Проверяем доступность места
    if (!this.isSeatAvailable(this.selectedSeat.seatNumber, carriage)) {
      alert('Это место уже забронировано!');
      return;
    }

    // Создаем новый сегмент
    const selectedSegment = this.getSelectedSegment(this.flight, this.searchParams.from, this.searchParams.to);

    // Создаем копию flight с выбранным сегментом
    const flightForOrder = {
      ...this.flight,
      segments: selectedSegment ? [selectedSegment] : this.flight.segments,
      selectedFrom: this.searchParams.from,
      selectedTo: this.searchParams.to
    };

    // Создаем заказ
    const order = this.orderService.createOrder(
      flightForOrder,
      this.selectedSeat.seatNumber,
      `№${this.getSelectedCarriageNumber()}`,
      `${this.getSelectedPrice()} RUB`
    );

    // Обновляем локальное состояние
    if (!this.occupiedSeatsMap[this.selectedSeat.carriageId]) {
      this.occupiedSeatsMap[this.selectedSeat.carriageId] = [];
    }
    this.occupiedSeatsMap[this.selectedSeat.carriageId].push(this.selectedSeat.seatNumber);
    
    // Обновляем availableSeats
    carriage.availableSeats--;
    
    // Сбрасываем выбранное место
    this.selectedSeat = null;

    // Только после успешного бронирования переходим на страницу заказов
    this.router.navigate(['/orders']);
  }

  private showAuthRequiredDialog(): void {
    alert('Для бронирования места необходимо авторизоваться. Пожалуйста, войдите в систему или зарегистрируйтесь.');
  }

  private getSelectedSegment(flight: Flight, fromCity: string, toCity: string): FlightSegment | null {
    // Ищем сегмент, который точно соответствует выбранному маршруту
    const exactSegment = flight.segments.find(segment => 
      segment.fromCity === fromCity && segment.toCity === toCity
    );

    if (exactSegment) return exactSegment;

    // Если точного совпадения нет, создаем новый сегмент на основе маршрута
    const fromSegment = flight.segments.find(segment => segment.fromCity === fromCity);
    const toSegment = flight.segments.find(segment => segment.toCity === toCity);

    if (fromSegment && toSegment) {
      return {
        fromCity,
        toCity,
        departureTime: fromSegment.departureTime,
        arrivalTime: toSegment.arrivalTime,
        duration: new Date(toSegment.arrivalTime.getTime() - fromSegment.departureTime.getTime()),
        hasStop: true,
        stopDuration: this.calculateStopDuration(flight.segments, fromCity, toCity)
      };
    }

    return null;
  }

  private calculateStopDuration(segments: FlightSegment[], fromCity: string, toCity: string): string {
    const fromIndex = segments.findIndex(s => s.fromCity === fromCity);
    const toIndex = segments.findIndex(s => s.toCity === toCity);

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return '';

    let totalMinutes = 0;
    for (let i = fromIndex; i < toIndex; i++) {
      if (segments[i].stopDuration) {
        const mins = parseInt(segments[i].stopDuration?.match(/\d+/)?.[0] || '0');
        totalMinutes += mins;
      }
    }
    
    return totalMinutes > 0 ? `${totalMinutes} мин` : '';
  }
}
