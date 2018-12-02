import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from '../../node_modules/rxjs';
import {ExchangeRates} from './ExchangeRates';

@Injectable()
export class AppService {

  private BASE_URL = 'https://api.exchangeratesapi.io';

  constructor(
    private http: HttpClient
  ) { }

  getText(data): Observable<ExchangeRates> {
    const url = `${this.BASE_URL}/${data.date}?base=${data.currency}`;
    return this.http.get<ExchangeRates>(url);
  }
}
