import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_COOKIE_KEY = 'app_language';
  private readonly SUPPORTED_LANGS = ['en', 'ru'];
  private readonly DEFAULT_LANG = 'en';

  constructor(
    private translateService: TranslateService,
    private cookieService: CookieService
  ) {
    this.initLanguage();
  }

  initLanguage(): void {
    let currentLang = this.cookieService.get(this.LANG_COOKIE_KEY);
    
    if (!currentLang) {
      currentLang = this.getBrowserLang();
      this.cookieService.set(this.LANG_COOKIE_KEY, currentLang, { expires: 365 });
    }
    
    this.translateService.use(currentLang);
  }

  changeLanguage(lang: string): void {
    if (this.SUPPORTED_LANGS.includes(lang)) {
      this.translateService.use(lang);
      this.cookieService.set(this.LANG_COOKIE_KEY, lang, { expires: 365 });
    }
  }

  getCurrentLanguage(): string {
    return this.translateService.currentLang || this.cookieService.get(this.LANG_COOKIE_KEY) || this.DEFAULT_LANG;
  }

  getSupportedLanguages(): string[] {
    return [...this.SUPPORTED_LANGS];
  }

  private getBrowserLang(): string {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return this.DEFAULT_LANG;
    }

    const browserLang = navigator.language;
    const primaryLang = browserLang.split('-')[0];
    
    return this.SUPPORTED_LANGS.includes(primaryLang) ? primaryLang : this.DEFAULT_LANG;
  }
}
