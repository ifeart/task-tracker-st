import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { ThemeServiceService, ThemeMode } from './theme-service.service';

describe('ThemeServiceService', () => {
  let service: ThemeServiceService;
  let mockDocument: any;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockRendererFactory: jasmine.SpyObj<RendererFactory2>;
  let mockHtmlElement: any;
  let mockLocalStorage: any;
  let originalLocalStorage: Storage;
  let originalMatchMedia: any;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    originalMatchMedia = window.matchMedia;

    mockHtmlElement = {};
    mockDocument = {
      documentElement: mockHtmlElement
    };
    
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute']);
    mockRendererFactory = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
    mockRendererFactory.createRenderer.and.returnValue(mockRenderer);

    mockLocalStorage = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem')
    };
    
    const mockMediaQuery = {
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    Object.defineProperty(window, 'matchMedia', {
      value: jasmine.createSpy('matchMedia').and.returnValue(mockMediaQuery),
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [
        ThemeServiceService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: RendererFactory2, useValue: mockRendererFactory }
      ]
    });

    service = TestBed.inject(ThemeServiceService);
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
    
    Object.defineProperty(window, 'matchMedia', {
      value: originalMatchMedia,
      writable: true
    });
  });

  describe('дефолт', () => {
    it('должен создаться', () => {
      expect(service).toBeTruthy();
    });

    it('должен сохранить режим темы', () => {
      service.setThemeMode('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
    });

    it('должен определить активный режим', () => {
      service.setThemeMode('dark');
      
      expect(service.isThemeModeActive('dark')).toBe(true);
      expect(service.isThemeModeActive('light')).toBe(false);
      expect(service.isThemeModeActive('auto')).toBe(false);
    });
  });

  describe('Observable', () => {
    it('должен уведомить об изменении темы', (done) => {
      let callCount = 0;
      service.themeMode$.subscribe(mode => {
        callCount++;
        if (callCount === 2) {
          expect(mode).toBe('light');
          done();
        }
      });
      service.setThemeMode('light');
    });
  });

  describe('ошибки', () => {
    it('localStorage недоступен', () => {
      mockLocalStorage.setItem.and.throwError('localStorage недоступен');
      spyOn(console, 'warn');
      
      expect(() => service.setThemeMode('dark')).not.toThrow();
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
