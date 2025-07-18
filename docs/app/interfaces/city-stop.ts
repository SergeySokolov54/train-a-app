export interface CityStop {
  name: string;
  timeOffset: string;       // Смещение времени от базового времени (например "08:00")
  isStop?: boolean;         // Является ли остановкой
  stopDuration?: string;    // Длительность остановки
}