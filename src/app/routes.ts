import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { HeaderComponent } from './components/header/header.component';
import { OrdersComponent } from './components/orders/orders.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { FilterSearchComponent } from './components/filter-search/filter-search.component';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';


export const routes: Routes = [
  { 
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent,},
      { path: 'flight-details/:id', component: FlightDetailsComponent},
      { path: 'profile', component: ProfileComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'registration', component: RegistrationComponent},
      { path: 'authorization', component: AuthorizationComponent}
    ]
  },
  { path: '**', redirectTo: '' }, // Важно для обработки 404
  // Другие маршруты...
];