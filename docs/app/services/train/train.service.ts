import { Injectable } from '@angular/core';
import { Train } from '../../interfaces/train';
import { Carriage } from '../../interfaces/carriage';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  public trains: Train[] = [
    {
      id: 1,
      name: "Поезд 1",
      carriages: [
        {
          id: 201,
          name: "Плацкарт",
          classComfort: 2,
          availableSeats: 40,
          allSeats: 40,
          price: 3200
        },
        {
          id: 202,
          name: "Купе",
          classComfort: 1,
          availableSeats: 40,
          allSeats: 40,
          price: 4500
        }
      ]
    },
    {
      id: 2,
      name: "Поезд 2",
      carriages: [
        {
          id: 203,
          name: "Плацкарт",
          classComfort: 2,
          availableSeats: 40,
          allSeats: 40,
          price: 3200
        },
        {
          id: 204,
          name: "Купе",
          classComfort: 1,
          availableSeats: 40,
          allSeats: 40,
          price: 4500
        }
      ]
    }
  ];
  constructor() { }

  getOriginalCarriage(carriageId: number): Carriage | undefined {
    for (const train of this.trains) {
      const carriage = train.carriages.find(c => c.id === carriageId);
      if (carriage) return {...carriage}; // Возвращаем копию
    }
    return undefined;
  }
}