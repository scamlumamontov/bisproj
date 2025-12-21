import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { Router } from '@angular/router';

let refreshAttempted = false;

export const intrInterceptor: HttpInterceptorFn = (req, next) => {
  const access = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');

  const http = inject(HttpClient);
  const router = inject(Router);

    if(access) {
      const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access}`
      }
    });
    
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Main error', error);
    
        if (error.status === 401 && refresh && !refreshAttempted) {
          
          refreshAttempted = true;
    
          return http.post<any>('http://localhost:8000/api/auth/refresh/', { refresh }, {
            headers: { 'Content-Type': 'application/json' }
          }).pipe(
            switchMap((data) => {
              refreshAttempted = false;
              localStorage.setItem('access', data.access);
              
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${data.access}`
                }
              });
              
              return next(retryReq);
            }),
            catchError(err => {
              refreshAttempted = false;
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              window.location.href = '/login';
              return throwError(() => err);
            })
          );
        }
    
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
