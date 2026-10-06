import { Component, input } from '@angular/core';
import { BreadCrumbsComponent } from '../bread-crumbs/bread-crumbs.component';

@Component({
  selector: 'app-page-header',
  imports: [BreadCrumbsComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  title = input('');
  description = input('');
  breadCrumbs = input<any[]>([]);
  icon = input('fas fa-box-open');
}