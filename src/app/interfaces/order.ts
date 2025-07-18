import { Flight } from "./flight";

export interface Order {
    id: number;
    userId: string;
    flight: Flight;
    numberSeat: number;
    numberCarriage: string;
    price: string;
    isActive: boolean;
}
