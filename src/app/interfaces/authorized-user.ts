import { Order } from "./order";

export interface AuthorizedUser {
    id: number;
    name: string;
    email: string;
    orders: Order[];
    password: string;
    isAdmin: boolean;
}
