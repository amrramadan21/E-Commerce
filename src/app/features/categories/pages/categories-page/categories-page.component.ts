import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CategoriesService } from '../../services/categories.service';
import { ICategory } from '../../interfaces/IGetAllCategories';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-page',
  imports: [PageHeaderComponent, RouterLink],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css',
})
export class CategoriesPageComponent implements OnInit {
  // injected services
  private readonly categoriesService = inject(CategoriesService);

  breadCrumbs = [{ name: 'Categories', url: ['/categories'] }];
  pageTitle = 'All Categories';
  pageDescription = 'Browse our wide range of product categories';

  allCategories = signal<null | ICategory[]>(null);

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        console.log(response);
        this.allCategories.set(response.data);
      },
    });
  }
}