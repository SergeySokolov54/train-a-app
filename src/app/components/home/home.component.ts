import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FilterSearchComponent } from '../filter-search/filter-search.component';
import { FilterService } from '../../services/filter/filter.service';
import { ResultListComponent } from '../result-list/result-list.component';
import { FlightService } from '../../services/flight/flight.service';
import { Flight } from '../../interfaces/flight';
import { StateHomeItemsService } from '../../services/state-home-items/state-home-items.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    FilterSearchComponent,
    ResultListComponent,
    CommonModule],
  template: `
    <div class="search-module">
      <form>
        <input class="inputs-search-module inputs-from-to"
              id="myInput"
              type="text"
              placeholder="From"
              [formControl]="controlFrom"
              [matAutocomplete]="autoFrom">
        <mat-autocomplete #autoFrom="matAutocomplete">
          @for (street of filteredStreetsFrom | async; track street) {
            <mat-option [value]="street">{{street}}</mat-option>
          }
        </mat-autocomplete>
      </form>
      <mat-icon class="swap-icon" (click)="swapInputs()">swap_horiz</mat-icon>
      <form>
        <input class="inputs-search-module inputs-from-to"
              type="text"
              placeholder="To"
              [formControl]="controlTo"
              [matAutocomplete]="autoTo">
        <mat-autocomplete #autoTo="matAutocomplete">
          @for (street of filteredStreetsTo | async; track street) {
            <mat-option [value]="street">{{street}}</mat-option>
          }
        </mat-autocomplete>
      </form>

      <div class="inputs-search-module position-elem">
        <input class="input-choose-date"
          placeholder="Choose a date"
          matInput
          [matDatepicker]="picker"
          [formControl]="dateControl">
        <mat-datepicker-toggle class="icon-choose-date" matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </div>

      <div class="container-btn-search">
        <button class="btn-search" id="basic" type="button" mat-button (click)="toggleFilterSearch()">Search</button>
      </div>
    </div>
    <filter-search-component
      *ngIf="showFilterSearch"
      [searchParams]="searchParams"
      (dateSelected)="onDateSelected($event)"></filter-search-component>
    <app-result-list
      [flights]="filteredFlights"
      [showResults]="showResults && !!(controlFrom.value || controlTo.value)
      "></app-result-list>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  controlFrom = new FormControl('');
  controlTo = new FormControl('');
  dateControl = new FormControl<Date | null>(null);
  cities: string[] = ['Нижний Новгород', 'Москва', 'Санкт-Петербург'];
  filteredStreetsFrom!: Observable<string[]>;
  filteredStreetsTo!: Observable<string[]>;

  showFilterSearch = false;
  searchParams: {from: string, to: string, date: Date | null} | null = null;

  filteredFlights: Flight[] = [];
  showResults: boolean = false;

  constructor(
    private stateService: StateHomeItemsService,
    private filterService: FilterService,
    private flightService: FlightService,
    private userService: UserService,
  ) {}


  ngOnInit() {

    // Восстанавливаем состояние при инициализации
    if (this.stateService.searchParams.isSearchClicked) {
      this.controlFrom.setValue(this.stateService.searchParams.from);
      this.controlTo.setValue(this.stateService.searchParams.to);
      this.dateControl.setValue(this.stateService.searchParams.date);
      this.showResults = true;
      this.filteredFlights = this.getFilteredFlights();
    }

    this.userService.currentUser$.subscribe(status => {
      if (status === 'anon') {
        this.resetHomeState();
      }
    });

    this.filteredStreetsFrom = this.controlFrom.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.filteredStreetsTo = this.controlTo.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filterService.showFilterSearch$.subscribe(show => {
      this.showFilterSearch = show;
    });

    this.filterService.searchParams$.subscribe(params => {
      this.searchParams = params;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.cities.filter(cities => this._normalizeValue(cities).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  swapInputs() {
    const fromValue = this.controlFrom.value || ''
    const toValue = this.controlTo.value || ''

    this.controlFrom.setValue(toValue)
    this.controlTo.setValue(fromValue)
  }

  toggleFilterSearch() {
    // Сохраняем состояние перед навигацией
    this.stateService.searchParams = {
      from: this.controlFrom.value || '',
      to: this.controlTo.value || '',
      date: this.dateControl.value,
      isSearchClicked: true
    };

    const currentFrom = this.controlFrom.value;
    const currentTo = this.controlTo.value;
    const currentDate = this.dateControl.value;

    this.filterService.toggleFilterSearch(currentFrom, currentTo, currentDate);

    // Показываем результаты только после нажатия кнопки Search
    this.showResults = true;
    this.filteredFlights = this.getFilteredFlights();
  }

  private getFilteredFlights(): Flight[] {
    return this.flightService.getFilteredFlights(
      this.dateControl.value,
      this.controlFrom.value,
      this.controlTo.value
    );
  }


  onDateSelected(selectedDate: Date) {
    this.dateControl.setValue(selectedDate);
    // Обновляем searchParams чтобы перерисовать компонент
    this.searchParams = {
      ...this.searchParams!,
      date: selectedDate
    };

     // Обновляем фильтрацию при изменении даты
    this.filteredFlights = this.flightService.getFilteredFlights(
      selectedDate,
      this.controlFrom.value,
      this.controlTo.value
    );
    }

  resetHomeState() {
    this.controlFrom.setValue('');
    this.controlTo.setValue('');
    this.dateControl.setValue(null);
    this.showFilterSearch = false;
    this.showResults = false;
    this.filteredFlights = [];
    this.stateService.searchParams = {
      from: '',
      to: '',
      date: null,
      isSearchClicked: false
    };
  }

}