import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

declare var M: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('mobileSidenav', { static: false }) mobileSidenav!: ElementRef;

  ngAfterViewInit(): void {
    if (this.mobileSidenav) {
      M.Sidenav.init(this.mobileSidenav.nativeElement);
    }
  }
}
