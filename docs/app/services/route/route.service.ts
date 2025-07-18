import { Injectable } from '@angular/core';
import { Route } from '../../interfaces/route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  routes: Route[] = [
    // Нижний Новгород -> Москва (прямой)
    {
      id: 101,
      nameRoute: "Нижний Новгород - Москва",
      cities: [
        { name: "Нижний Новгород", timeOffset: "08:00", isStop: false },
        { name: "Москва", timeOffset: "11:30", isStop: false }
      ]
    },
    // Москва -> Нижний Новгород (прямой)
    {
      id: 102,
      nameRoute: "Москва - Нижний Новгород",
      cities: [
        { name: "Москва", timeOffset: "12:00", isStop: false },
        { name: "Нижний Новгород", timeOffset: "15:30", isStop: false }
      ]
    },
    // Нижний Новгород -> Санкт-Петербург (через Москву)
    {
      id: 103,
      nameRoute: "Нижний Новгород - Санкт-Петербург",
      cities: [
        { name: "Нижний Новгород", timeOffset: "08:00", isStop: false },
        { name: "Москва", timeOffset: "11:30", isStop: true, stopDuration: "30 мин" },
        { name: "Санкт-Петербург", timeOffset: "16:30", isStop: false }
      ]
    },
    // Санкт-Петербург -> Нижний Новгород (через Москву)
    {
      id: 104,
      nameRoute: "Санкт-Петербург - Нижний Новгород",
      cities: [
        { name: "Санкт-Петербург", timeOffset: "10:00", isStop: false },
        { name: "Москва", timeOffset: "14:30", isStop: true, stopDuration: "30 мин" },
        { name: "Нижний Новгород", timeOffset: "18:30", isStop: false }
      ]
    },
    // Москва -> Санкт-Петербург (прямой)
    {
      id: 105,
      nameRoute: "Москва - Санкт-Петербург",
      cities: [
        { name: "Москва", timeOffset: "14:00", isStop: false },
        { name: "Санкт-Петербург", timeOffset: "18:30", isStop: false }
      ]
    },
    // Санкт-Петербург -> Москва (прямой)
    {
      id: 106,
      nameRoute: "Санкт-Петербург - Москва",
      cities: [
        { name: "Санкт-Петербург", timeOffset: "15:00", isStop: false },
        { name: "Москва", timeOffset: "19:30", isStop: false }
      ]
    }
  ];
  constructor() { }
  
}