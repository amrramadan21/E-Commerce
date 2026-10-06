import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { App_Apis } from '../../../core/constants/app-apis';
import { IAllProductsResponse } from '../interfaces/IAllProductsResponse';
import { IProductDetailsResponse } from '../interfaces/IProductDetailsResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  getAllProducts(filter?: {}) {
    const params = new HttpParams({
      fromObject: filter,
    });

    return this.http.get<IAllProductsResponse>(App_Apis.products.get, {
      params: params,
    });
  }

  getProductById(productId: string) {
    return this.http.get<IProductDetailsResponse>(`${App_Apis.products.get}/${productId}`);
  }
}