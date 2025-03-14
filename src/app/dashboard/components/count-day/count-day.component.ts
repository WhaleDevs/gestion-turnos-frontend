import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-count-day',
  templateUrl: './count-day.component.html',
  styleUrl: './count-day.component.scss'
})
export class CountDayComponent implements OnInit, OnDestroy {
  hourMinutes: string = '';
  private intervalId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.updateTime();
    this.syncWithNextMinute();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
  }

  private updateTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    this.hourMinutes = `${hour}:${minute}`;
  }

  private syncWithNextMinute() {
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();

    this.intervalId = setTimeout(() => {
      this.updateTime();
      this.intervalId = setInterval(() => {
        this.updateTime();
      }, 60000);
    }, secondsUntilNextMinute * 1000);
  }
}
