import { CanActivateFn, Router } from '@angular/router';
import { Stored_Keys } from '../constants/stored-keys';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platform = inject(PLATFORM_ID);

  if (isPlatformBrowser(platform)) {
    const token = localStorage.getItem(Stored_Keys.token);

    if (token) {
      return true;
    } else {
      return router.createUrlTree(['/login'], {
        queryParams: { redirectUrl: state.url },
      });
    }
  } else {
    return true;
  }
};