import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private translations: any = {};
  private currentLang = 'es';

  public langChange$ = new BehaviorSubject<string>(this.currentLang);

  constructor(private http: HttpClient) {
    this.loadTranslations();
  }

  private loadTranslations() {
    this.http.get('/src/translations.json').subscribe((data) => {
      this.translations = data;
    });
  }

  setLanguage(lang: string) {
    this.currentLang = lang;
    this.langChange$.next(lang);
  }

  get currentLanguage(): string {
    return this.currentLang;
  }

  translate(path: string): string {
    const keys = path.split('.');
    let value = this.translations[this.currentLang];

    for (const key of keys) {
      if (!value) break;
      value = value[key];
    }

    return value || path;
  }
}
