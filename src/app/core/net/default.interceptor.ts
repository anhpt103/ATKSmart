import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponseBase,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

const CODEMESSAGE = {
  200: 'The server successfully returned the requested data. ',
  201: 'New or modified data was successful. ',
  202: 'A request has entered the background queue (asynchronous task). ',
  204: 'Delete data successfully. ',
  400: 'There was an error in the request sent, and the server did not create or modify data. ',
  401: 'The user does not have permission (token, username, password is wrong). ',
  403: 'The user is authorized, but access is prohibited. ',
  404: 'The request sent was for a non-existent record, and the server did not operate. ',
  406: 'The requested format is not available. ',
  410: 'The requested resource is permanently deleted and will no longer be obtained. ',
  422: 'When creating an object, a validation error occurred. ',
  500: 'An error occurred on the server, please check the server. ',
  502: 'Gateway error. ',
  503: 'Service is unavailable, the server is temporarily overloaded or maintained. ',
  504: 'The gateway timed out. ',
};

/**
 * The default HTTP interceptor. For registration details, see `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase) {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
      return;
    }

    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    this.notification.error(`Request error ${ev.status}: ${ev.url}`, errortext);
  }

  private handleData(ev: HttpResponseBase): Observable<any> {
    // It may not be possible to perform the `end()` operation of `_HttpClient` because of `throw` export
    if (ev.status > 0) {
      this.injector.get(_HttpClient).end();
    }
    this.checkStatus(ev);
    // Business processing: some common operations
    switch (ev.status) {
      case 200:
        // Business level error handling, the following is assumed to restrest has a unified
        // output format (regardless of success or failure has a corresponding data format) to deal with
        // For example the response content:
        // Error content: {status: 1, msg:'Illegal parameter'}
        // Correct content: {status: 0, response: {}}
        // then the following code snippet can be directly applied
        // if (event instanceof HttpResponse) {
        //     const body: any = event.body;
        //     if (body && body.status !== 0) {
        //         this.msg.error(body.msg);
        //         // Continue to throw errors to interrupt all subsequent Pipe and subscribe operations, so:
        //         // this.http.get('/').subscribe() 并不会触发
        //         return throwError({});
        //     } else {
        //        // Change the content of `body` to the content of `response`. For most scenes,
                  // you no longer need to care about the service status code
        //         return of(new HttpResponse(Object.assign(event, { body: body.response })));
        //         // Or still keep the complete format
        //         return of(event);
        //     }
        // }
        break;
      case 401:
        this.notification.error(
          `Not logged in or the login has expired, please log in again. `,
          ``
        );
        // Clear token information
        this.goTo('/auth/login');
        break;
      case 403:
      case 404:
      case 500:
        this.goTo(`/exception/${ev.status}`);
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn(
            'Unknown error, mostly due to backend not supporting CORS or invalid configuration',
            ev
          );
        }
        break;
    }
    if (ev instanceof HttpErrorResponse) {
      return throwError(ev);
    } else {
      return of(ev);
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Unified plus server prefix
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }

    const newReq = req.clone({ url });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // Allow unified handling of request errors
        if (event instanceof HttpResponseBase) {
          return this.handleData(event);
        }
        // If everything is normal, follow up
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }
}
