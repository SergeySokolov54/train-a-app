import { CityStop } from "./city-stop";

export interface Route {
    id: number;
    nameRoute: string;
    cities: CityStop[];
}
