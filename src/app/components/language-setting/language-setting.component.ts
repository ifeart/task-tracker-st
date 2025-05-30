import { Component, ElementRef, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../data/services/language.service';
import { ThemeServiceService, type ThemeMode } from '../../data/services/theme-service.service';

declare var M: any;

@Component({
  selector: 'app-language-setting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-setting.component.html',
  styleUrls: ['./language-setting.component.scss']
})
export class LanguageSettingComponent implements OnInit, AfterViewInit {
  languages: string[] = [];
  currentLanguage: string = '';
  languageService = inject(LanguageService);
  themeService = inject(ThemeServiceService);
  @ViewChild('fixedActionBtn', { static: false }) fixedActionBtn!: ElementRef;

  ngOnInit(): void {
    this.languages = this.languageService.getSupportedLanguages();
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  ngAfterViewInit(): void {
    if (this.fixedActionBtn) {
      M.FloatingActionButton.init(this.fixedActionBtn.nativeElement, {
        direction: 'left',
        hoverEnabled: true,
        menuEnabled: true,
      });
    }
  }

  changeLanguage(lang: string): void {
    this.languageService.changeLanguage(lang);
    this.currentLanguage = lang;
  }

  setThemeMode(mode: ThemeMode): void {
    this.themeService.setThemeMode(mode);
  }

  isThemeModeActive(mode: ThemeMode): boolean {
    return this.themeService.isThemeModeActive(mode);
  }

}
