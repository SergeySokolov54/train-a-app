import { Injectable } from '@angular/core';
import { FilterService } from '../filter/filter.service';

@Injectable({
  providedIn: 'root'
})
export class StateHomeItemsService {

  constructor(private filterService: FilterService) {}
  searchParams = {
    from: '',
    to: '',
    date: null as Date | null,
    isSearchClicked: false
  };

  resetState() {
    this.searchParams = {
      from: '',
      to: '',
      date: null,
      isSearchClicked: false
    };
    this.filterService.resetFilter();
  }
}