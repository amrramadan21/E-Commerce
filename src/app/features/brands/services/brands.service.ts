import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { App_Apis } from '../../../core/constants/app-apis';

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllBrandsResponse {
  results: number;
  metadata: { currentPage: number; numberOfPages: number; limit: number };
  data: IBrand[];
}

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly http = inject(HttpClient);

  getAllBrands(filter?: {}) {
    return this.http.get<IGetAllBrandsResponse>(App_Apis.brands.get, {
      params: filter as Record<string, string>,
    });
  }

  getBrandById(id: string) {
    return this.http.get<{ data: IBrand }>(`${App_Apis.brands.get}/${id}`);
  }
}
