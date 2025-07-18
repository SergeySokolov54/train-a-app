import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'filter-search-component',
  imports: [
    CommonModule,
    MatIcon],
  template: `
    <div class="search-container">
      <div *ngIf="dateRange?.length" class="search-results">
        <div
          class="container-icon-left-right"
          (click)="moveDateBackward()">
          <mat-icon class="arrow-left-right">keyboard_arrow_left</mat-icon>
        </div>
        <div 
          class="date-group"
          *ngFor="let dateGroup of dateRange"
          [class.selected]="isSelected(dateGroup.date)"
          (click)="handleDateClick(dateGroup.date)">

          <p class="date-title"> {{ dateGroup.date | date: 'MMMM d' }} </p>
          <p class="date-subtitle"> {{ dateGroup.date | date: 'EEEE' }} </p>
          
        </div>
        <div
          class="container-icon-left-right"
          (click)="moveDateForward()">
          <mat-icon class="arrow-left-right">keyboard_arrow_right</mat-icon>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./filter-search.component.scss']
})
export class FilterSearchComponent {
  @Input() searchParams: {from: string, to: string, date: Date | null} | null = null;

  @Output() dateSelected = new EventEmitter<Date>();


  ngOnChanges(changes: SimpleChanges) {
    if(this.searchParams?.date) {
      this.selectedDate = new Date(this.searchParams.date);
      this.generateDateRange(this.selectedDate)
    }
  }


  dateRange: {date: Date}[] = []
  selectedDate: Date | null = null;

  isSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    return date.toDateString() === this.selectedDate.toDateString();
  }

  // Перемещение даты вперед (на день)
  moveDateForward() {
    if (!this.selectedDate) return;
    
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    this.updateSelectedDate(newDate);
  }

  // Перемещение даты назад (на день)
  moveDateBackward() {
    if (!this.selectedDate) return;
    
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    this.updateSelectedDate(newDate);
  }

  // Общая логика обновления даты
  private updateSelectedDate(newDate: Date) {
    this.selectedDate = newDate;
    this.generateDateRange(newDate);
    this.dateSelected.emit(newDate);
  }

  selectDate(date: Date) {
    if (!date || isNaN(date.getTime())) return;

    this.selectedDate = new Date(date);
    this.dateSelected.emit(this.selectedDate);
  }


  handleDateClick(clickedDate: Date) {
    if (!this.selectedDate) return;
    
    if (this.isSelected(clickedDate)) return;
    
    let newDate: Date;
    const clickedTime = clickedDate.getTime();
    const selectedTime = this.selectedDate.getTime();
    
    const oneDayMs = 86400000;
    newDate = new Date(this.selectedDate);
    if (clickedTime > selectedTime) {
      newDate.setDate(newDate.getDate() + 1);
    } else if ((selectedTime - 2 * oneDayMs) === clickedTime) {
      newDate = new Date(this.selectedDate);
      newDate.setDate(newDate.getDate() - 2);
    } else if((selectedTime - oneDayMs) === clickedTime) {
      newDate = new Date(this.selectedDate);
      newDate.setDate(newDate.getDate() - 1);
    }
    
    this.selectedDate = newDate;
    this.generateDateRange(newDate);
    this.dateSelected.emit(newDate);
  }


  generateDateRange(selectedDate: Date) {
    const dates = []

    for(let i = 2; i > 0; i--) {
      const date = new Date(selectedDate)
      date.setDate(selectedDate.getDate() - i)
      dates.push({date})
    }

    dates.push({date: new Date(selectedDate)})

    const date = new Date(selectedDate)
    date.setDate(selectedDate.getDate() + 1)
    dates.push({date})

    this.dateRange = dates;
  }


}