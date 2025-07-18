import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private searchParamsSubject = new BehaviorSubject<{from: string, to: string, date: Date | null} | null>(null);
  private showFilterSearchSubject = new BehaviorSubject<boolean>(false);
  
  searchParams$ = this.searchParamsSubject.asObservable();
  showFilterSearch$ = this.showFilterSearchSubject.asObservable();

  resetFilter() {
    this.showFilterSearchSubject.next(false);
    this.searchParamsSubject.next(null);
  }

  updateSearchParams(from: string, to: string, date: Date | null) {
    const newParams = { from, to, date };
    this.searchParamsSubject.next(newParams);
  }

  toggleFilterSearch(from: string | null, to: string | null, date: Date | null): boolean {
    if (!from || !to || !date) {
      alert('Пожалуйста, заполните все поля');
      return false;
    }

    if (from === to) {
      alert('Места отправления и прибытия не должны совпадать')
      return false;
    }

    const currentParams = this.searchParamsSubject.value;
    const paramsChanged = !currentParams || 
      from !== currentParams.from || 
      to !== currentParams.to || 
      date !== currentParams.date;

    if (paramsChanged || !this.showFilterSearchSubject.value) {
      this.updateSearchParams(from, to, date);
      this.showFilterSearchSubject.next(true);
      return true;
    }
    return false;
  }
}