import { Carriage } from "./carriage";

export interface Train {
    id: number;
    carriages: Carriage[];
    name: string;
}
