import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';
import { firstValueFrom } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  return checkUserSession(sessionService, router);
};

async function checkUserSession(
  sessionService: SessionService, 
  router: Router
): Promise<boolean | UrlTree> {
  try {
    await sessionService.restoreSessionIfNeeded();
    const userSession = await firstValueFrom(sessionService.getSession$);

    return userSession ? true : router.createUrlTree(['auth/login']);
  } catch (err) {
    console.error('Error en AuthGuard:', err);
    sessionService.clearSession();
    return router.createUrlTree(['auth/login']);
  }
}
