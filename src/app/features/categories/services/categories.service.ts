import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { App_Apis } from '../../../core/constants/app-apis';
import { IAllProductsResponse } from '../../products/interfaces/IAllProductsResponse';
import { ICategory, IGetAllCategories } from '../interfaces/IGetAllCategories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);

  getAllCategories() {
    return this.http.get<IGetAllCategories>(App_Apis.categories.get);
  }
  getCategoryById(id: string) {
    return this.http.get<{ data: ICategory }>(`${App_Apis.categories.get}/${id}`);
  }
}