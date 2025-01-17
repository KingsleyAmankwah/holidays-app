import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayCalenderComponent } from './components/holiday-calender/holiday-calender.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HolidayCalenderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'holidays-app';
}
