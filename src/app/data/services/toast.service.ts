import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private translateService: TranslateService) { }

  showToast(text: string) {
    new (window as any).M.Toast({text: this.translateService.instant('TOAST.' + text), classes: 'rounded'});
  }
}
