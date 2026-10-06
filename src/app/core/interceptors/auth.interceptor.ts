import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Stored_Keys } from '../constants/stored-keys';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platform = inject(PLATFORM_ID);

  // Prepend base URL to all relative requests
  let fullReq = req;
  if (!req.url.startsWith('http')) {
    fullReq = req.clone({
      url: `${environment.baseUrl}/${req.url}`,
    });
  }

  // Attach JWT token if available
  if (isPlatformBrowser(platform)) {
    const token = localStorage.getItem(Stored_Keys.token);
    if (token) {
      fullReq = fullReq.clone({
        setHeaders: { token },
      });
    }
  }

  return next(fullReq);
};
