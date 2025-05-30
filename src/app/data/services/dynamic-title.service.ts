import { inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicTitleService {
  private titleService = inject(Title); 
  private metaService = inject(Meta);
  private translateService = inject(TranslateService);
  setTitle(title: string = ''): void {
    if (title) {
      const titleText = this.translateService.instant(title);
      this.titleService.setTitle(`${titleText} • ifeTask`);
    } else this.titleService.setTitle('ifeTask');
  }

  setNewTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  setMetaTags(description: string, keywords: string): void {
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
  }

  setMetaData(title: string, description: string, keywords: string): void {
    this.setTitle(title);
    this.setMetaTags(description, keywords);
  }
}