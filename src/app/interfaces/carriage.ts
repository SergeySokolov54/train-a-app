export interface Carriage {
    id: number
    name: string;
    classComfort: number;
    availableSeats: number;
    allSeats: number;
    price: number;
    bookedSeats?: number[];
}
