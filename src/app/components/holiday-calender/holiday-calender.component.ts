import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HolidayService } from '../../services/holiday.service';
import { Holiday } from '../../interfaces';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { COUNTRIES } from '../../data/country-data';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-holiday-calender',
  standalone: true,
  imports: [FormsModule, FullCalendarModule, DatePipe],
  templateUrl: './holiday-calender.component.html',
  styleUrl: './holiday-calender.component.css',
})
export class HolidayCalenderComponent {
  protected countries = COUNTRIES;
  // Signals
  protected selectedCountry = signal<string>('US');
  protected currentHolidays = signal<Holiday[]>([]);
  protected isLoading = signal<boolean>(false);
  protected error = signal<string | null>(null);
  private holidayService = inject(HolidayService);
  private debounceTimeout: null | ReturnType<typeof setTimeout> = null;

  constructor() {
    // Effect to reload holidays when country changes
    effect(
      () => {
        const country = this.selectedCountry();
        const today = new Date();
        this.loadHolidays(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDay() + 1
        );
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  // Computed values
  protected holidaysCount = computed(() => this.currentHolidays().length);
  protected selectedCountryName = computed(() => {
    const country = this.countries.find(
      (c) => c.code === this.selectedCountry()
    );
    return country ? country.name : this.selectedCountry();
  });

  protected calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
    datesSet: (dateInfo) => {
      const start = new Date(dateInfo.start);
      clearTimeout(this.debounceTimeout!);
      this.debounceTimeout = setTimeout(() => {
        this.loadHolidays(
          start.getFullYear(),
          start.getMonth() + 1,
          start.getDate()
        );
      }, 300);
    },
    eventDidMount: (info) => {
      info.el.title =
        info.event.extendedProps['description'] || info.event.title;
    },
  };

  private loadHolidays(year: number, month: number, day: number) {
    this.isLoading.set(true);
    this.error.set(null);

    this.holidayService
      .getHolidayForDay(this.selectedCountry(), year, month, day)
      .subscribe({
        next: (holidays) => {
          this.currentHolidays.set(holidays);
          console.log('Holidays:', holidays);
          const events: EventInput[] = holidays.map((holiday) => {
            const [month, day, year] = holiday.date.split('/');
            const formattedDate = `${year}-${month.padStart(
              2,
              '0'
            )}-${day.padStart(2, '0')}`;
            return {
              title: holiday.name,
              date: formattedDate,
              allDay: true,
              backgroundColor: '#3b82f6',
              borderColor: '#3b82f6',
              extendedProps: {
                description: holiday.description,
              },
            };
          });

          this.calendarOptions.events = events;
          console.log('events', events);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading holidays:', err);
          this.isLoading.set(false);
        },
      });
  }
}
