import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bread-crumbs',
  imports: [RouterLink],
  templateUrl: './bread-crumbs.component.html',
  styleUrl: './bread-crumbs.component.css',
})
export class BreadCrumbsComponent {
  pageTitle = input();
  cssClasses = input();
  breadCrumbs = input<any>([]);
}