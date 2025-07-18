export interface FlightSegment {
  fromCity: string;
  toCity: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: Date;
  hasStop?: boolean;
  stopDuration?: string;
}