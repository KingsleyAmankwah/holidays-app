import { Component } from '@angular/core';
import { HolidayService } from '../../services/holiday.service';
import { Holiday } from '../../interfaces';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  holidays: Holiday[] = [];
  loading = false;
  error = '';

  constructor(private holidayService: HolidayService) {}

  testApi() {
    this.loading = true;
    this.error = '';
    this.holidays = [];

    // Testing with Christmas 2025
    this.holidayService.getHolidayForDay('US', 2025, 12, 25).subscribe({
      next: (data) => {
        this.holidays = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.error = 'Failed to fetch holiday data';
        this.loading = false;
      },
    });
  }
}
