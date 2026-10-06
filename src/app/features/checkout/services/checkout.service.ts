import { Injectable } from '@angular/core';
import { baseHttp } from '../../../core/services/base-http.service';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService extends baseHttp {
  baseEndPoint = 'api/v2/orders/';
  oldBaseEndPoint = 'api/v1/orders/checkout-session/';

  onlinePayment(cartId: string, userData: {}) {
    return this.http.post<{ session: { url: string } }>(
      `${this.oldBaseEndPoint}${cartId}`,
      {
        shippingAddress: userData,
      },
      {
        params: new HttpParams({
          fromObject: { url: environment.appUrl },
        }),
      },
    );
  }

  cashPayment(cartId: string, userData: {}) {
    return this.http.post(`${this.baseEndPoint}${cartId}`, {
      shippingAddress: userData,
    });
  }
}