import { inject, Injectable } from '@angular/core';
import { Holiday } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private http = inject(HttpClient);
  private apiKey = environment.abstractApiKey;
  private baseUrl = environment.abstractApiUrl;

  public getHolidayForDay(
    country: string,
    year: number,
    month: number,
    day: number
  ): Observable<Holiday[]> {
    const params = {
      api_key: this.apiKey,
      country,
      year: year.toString(),
      month: month.toString(),
      day: day.toString(),
    };

    return this.http.get<Holiday[]>(this.baseUrl, { params });
  }
}
