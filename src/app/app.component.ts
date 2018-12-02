import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {ExchangeRates, Rate} from './ExchangeRates';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private static ASC = 'asc';
  private static DESC = 'desc';
  public sortOrder = 'asc';
  public currencies = ['EUR', 'USD', 'GBP', 'AUD', 'CAD', 'JPY'];
  public data = {
    currency: null,
    date: null
  };
  public rates: Rate[] = [];
  public loading: boolean;

  public static getRatePercent(input): number {
    return (5 / 100) * input;
  }

  public static getBuy(input): string {
    const rate = input - AppComponent.getRatePercent(input);
    return parseFloat(String(rate)).toFixed(4);
  }

  public static getSell(input): string {
    const rate = input + AppComponent.getRatePercent(input);
    return parseFloat(String(rate)).toFixed(4);
  }

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.data.currency = this.currencies[0];
    this.loading = false;
  }

  public isBase(value): boolean {
    return this.currencies.indexOf(value) !== -1;
  }

  public sort(): void {
    if (this.sortOrder === AppComponent.ASC) {
      this.sortDescending();
      this.sortOrder = AppComponent.DESC;
    } else {
      this.sortAscending();
      this.sortOrder = AppComponent.ASC;
    }
  }

  public display(): void {
    if (this.data.date === null) {
      alert('Please select date');
      return;
    }
    this.loading = true;
    this.appService.getText(this.data)
      .subscribe((exchangeRates: ExchangeRates) => {
        this.loading = false;
        this.rates.length = 0;
        for (const rate in exchangeRates.rates) {
          if (!exchangeRates.rates.hasOwnProperty(rate)) {
            continue;
          }
          const value = exchangeRates.rates[rate];
          this.rates.push({
            base: rate,
            buy: AppComponent.getBuy(value),
            sell: AppComponent.getSell(value)
          });
        }
      });
  }

  public updateDate(date): void {
    this.data.date = date;
  }

  public updateBase(base): void {
    this.data.currency = base;
  }

  private sortAscending(): void {
    this.rates.sort((a: Rate, b: Rate) => {
      if (a.base < b.base) {
        return -1;
      }
      if (a.base > b.base) {
        return 1;
      }
      return 0;
    });
  }

  private sortDescending(): void {
    this.rates.sort((a: Rate, b: Rate) => {
      if (a.base < b.base) {
        return 1;
      }
      if (a.base > b.base) {
        return -1;
      }
      return 0;
    });
  }
}
