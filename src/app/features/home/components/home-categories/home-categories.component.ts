import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../categories/services/categories.service';
import { ICategory } from '../../../categories/interfaces/IGetAllCategories';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-categories',
  imports: [RouterLink],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css',
})
export class HomeCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  allCategories = signal<null | ICategory[]>(null);

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.allCategories.set(response.data);
      },
    });
  }
}