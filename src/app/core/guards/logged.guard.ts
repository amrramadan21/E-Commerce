import { CanActivateFn, Router } from '@angular/router';
import { Stored_Keys } from '../constants/stored-keys';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const loggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platform = inject(PLATFORM_ID);

  if (isPlatformBrowser(platform)) {
    const token = localStorage.getItem(Stored_Keys.token);

    if (token) {
      // Already logged in — redirect away from auth pages
      return router.createUrlTree(['/']);
    } else {
      // Guest — allow access to login/register
      return true;
    }
  } else {
    return true;
  }
};