import { Injectable } from '@angular/core';
import { baseHttp } from '../../../core/services/base-http.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends baseHttp {
  baseUrl = 'api/v1/orders/user/';

  getUserOrders(userId: string) {
    return this.http.get(`${this.baseUrl}${userId}`);
  }
}