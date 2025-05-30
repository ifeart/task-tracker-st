import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'auto' | 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {
  private renderer: Renderer2;
  private currentThemeMode = new BehaviorSubject<ThemeMode>('auto');
  private mediaQuery: MediaQueryList;
  private mediaQueryListener: (e: MediaQueryListEvent) => void;

  public themeMode$: Observable<ThemeMode> = this.currentThemeMode.asObservable();

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.mediaQueryListener = (e: MediaQueryListEvent) => {
      if (this.currentThemeMode.value === 'auto') {
        this.applyTheme();
      }
    };

    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = this.getSavedThemeMode();
    this.setThemeMode(savedTheme);
    
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  setThemeMode(mode: ThemeMode): void {
    this.currentThemeMode.next(mode);
    this.saveThemeMode(mode);
    this.applyTheme();
  }

  isThemeModeActive(mode: ThemeMode): boolean {
    return this.currentThemeMode.value === mode;
  }

  private isSystemDarkMode(): boolean {
    return this.mediaQuery?.matches ?? false;
  }

  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme();
    const htmlElement = this.document.documentElement;
    
    if (effectiveTheme === 'dark') {
      this.renderer.setAttribute(htmlElement, 'theme', 'dark');
    } else {
      this.renderer.setAttribute(htmlElement, 'theme', 'light');
    }
  }

  private getEffectiveTheme(): 'light' | 'dark' {
    const mode = this.currentThemeMode.value;
    
    if (mode === 'auto') {
      return this.isSystemDarkMode() ? 'dark' : 'light';
    }
    
    return mode === 'dark' ? 'dark' : 'light';
  }

  private saveThemeMode(mode: ThemeMode): void {
    try {
      localStorage.setItem('theme-mode', mode);
    } catch (error) {
      console.warn('Failed to save theme mode to localStorage:', error);
    }
  }

  private getSavedThemeMode(): ThemeMode {
    try {
      const saved = localStorage.getItem('theme-mode');
      
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        return saved;
      }
    } catch (error) {
      console.warn('Failed to load theme mode from localStorage:', error);
    }
    
    return 'auto';
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }
}
