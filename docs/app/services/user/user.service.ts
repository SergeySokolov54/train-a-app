import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../../interfaces/order';
import { AuthorizedUser } from '../../interfaces/authorized-user';
import { StateHomeItemsService } from '../state-home-items/state-home-items.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<string>('anon');
  private currentUserSubject = new BehaviorSubject<AuthorizedUser | null>(null);
  private usersSubject = new BehaviorSubject<AuthorizedUser[]>([]);
  
  currentUser$ = this.userSubject.asObservable();
  currentUserData$ = this.currentUserSubject.asObservable();
  users$ = this.usersSubject.asObservable();

  private bookedSeats: {[flightId: number]: {carriageId: number, seatNumber: number, userId: string}[]} = {};


  constructor(private stateHomeItemsService: StateHomeItemsService) {
    this.loadUsersFromStorage();
  }

  private loadUsersFromStorage() {
    const savedStatus = localStorage.getItem('userStatus');
    const savedCurrentUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    
    if (savedStatus) {
      this.userSubject.next(savedStatus);
    }
    if (savedCurrentUser) {
      this.currentUserSubject.next(JSON.parse(savedCurrentUser));
    }
    if (savedUsers) {
      this.usersSubject.next(JSON.parse(savedUsers));
    }
  }

  get currentUserStatus() {
    return this.userSubject.value;
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }

  get users() {
    return this.usersSubject.value;
  }

  private saveUsersToStorage() {
    localStorage.setItem('users', JSON.stringify(this.usersSubject.value));
  }

  private changeUserStatus(userType: string) {
    this.userSubject.next(userType);
    localStorage.setItem('userStatus', userType);
  }

  private setCurrentUser(user: AuthorizedUser | null) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  signIn(credentials: {email: string, password: string}) {
    const user = this.usersSubject.value.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    this.setCurrentUser(user);
    this.changeUserStatus('auth');
  }

  signUp(userData: {name: string, email: string, password: string}) {
    const existingUser = this.usersSubject.value.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: AuthorizedUser = {
      id: this.usersSubject.value.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      orders: [],
      isAdmin: false
    };

    const updatedUsers = [...this.usersSubject.value, newUser];
    this.usersSubject.next(updatedUsers);
    this.saveUsersToStorage();

    this.setCurrentUser(newUser);
    this.changeUserStatus('auth');
  }

  signOut() {
    this.setCurrentUser(null);
    this.changeUserStatus('anon');
    this.stateHomeItemsService.resetState();
  }

  addOrderToUser(order: Order): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      order.userId = currentUser.email;
      currentUser.orders.push(order);
      
      // Update in users array
      const updatedUsers = this.usersSubject.value.map(u => 
        u.email === currentUser.email ? {...u, orders: [...u.orders, order]} : u
      );
      
      this.usersSubject.next(updatedUsers);
      this.setCurrentUser({...currentUser});
      this.saveUsersToStorage();
    }
  }

  getUserOrders(): Order[] {
    return this.currentUserSubject.value?.orders || [];
  }

  cancelUserOrder(orderId: number): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const orderIndex = currentUser.orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        currentUser.orders[orderIndex].isActive = false;
        
        // Update in users array
        const updatedUsers = this.usersSubject.value.map(u => 
          u.email === currentUser.email ? {...u, orders: [...u.orders]} : u
        );
        
        this.usersSubject.next(updatedUsers);
        this.setCurrentUser({...currentUser});
        this.saveUsersToStorage();
      }
    }
  }

  addBookedSeat(flightId: number, carriageId: number, seatNumber: number, userId: string): void {
    if (!this.bookedSeats[flightId]) {
      this.bookedSeats[flightId] = [];
    }
    
    // Проверяем, не забронировано ли уже это место
    const isAlreadyBooked = this.bookedSeats[flightId].some(
      seat => seat.carriageId === carriageId && seat.seatNumber === seatNumber
    );
    
    if (!isAlreadyBooked) {
      this.bookedSeats[flightId].push({
        carriageId,
        seatNumber,
        userId
      });
    }
  }

  getBookedSeats(flightId: number): {carriageId: number, seatNumber: number}[] {
    return this.bookedSeats[flightId]?.map(seat => ({
      carriageId: seat.carriageId,
      seatNumber: seat.seatNumber
    })) || [];
  }

  getBookedSeatsForCarriage(flightId: number, carriageId: number): number[] {
    return this.bookedSeats[flightId]?.filter(seat => seat.carriageId === carriageId)
                                     .map(seat => seat.seatNumber) || [];
  }

  removeBookedSeat(flightId: number, carriageId: number, seatNumber: number): void {
    if (this.bookedSeats[flightId]) {
      this.bookedSeats[flightId] = this.bookedSeats[flightId].filter(
        seat => !(seat.carriageId === carriageId && seat.seatNumber === seatNumber)
      );
    }
  }

  // Новый метод для получения carriageId по номеру вагона и flightId
  findCarriageId(flightId: number, carriageNumber: string): number | null {
    const orders = this.getUserOrders();
    const order = orders.find(o => 
      o.flight.id === flightId && o.numberCarriage === carriageNumber
    );
    
    if (order) {
      // Ищем вагон в поезде по номеру вагона (предполагаем формат "№X")
      const carriageNumberValue = parseInt(carriageNumber.replace('№', ''));
      const carriage = order.flight.train.carriages.find(
        c => c.id === (200 + carriageNumberValue) // или другая логика соответствия
      );
      return carriage?.id || null;
    }
    return null;
  }
}