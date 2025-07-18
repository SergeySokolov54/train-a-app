import { FlightSegment } from "./flight-segment";
import { Route } from "./route";
import { Train } from "./train";

export interface Flight {
    id: number;
    route: Route;
    train: Train;
    segments: FlightSegment[]; // Добавляем сегменты маршрута
    baseDepartureDate: Date;  // Базовая дата отправления всего рейса
    baseArrivalDate: Date;    // Базовая дата прибытия всего рейса
    totalDuration: Date;      // Общая продолжительность всего маршрута
}