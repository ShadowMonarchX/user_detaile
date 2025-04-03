import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable()
export class UserInterceptor implements HttpInterceptor {
  constructor(private authService: AuthServiceService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const api_url = environment.SERVER_URL;
    const authToken = this.authService.getToken();

    const authType = {
      url: api_url + request.url,
      headers: request.headers.set('Authorization', 'Bearer ' + authToken),
    };
    const authRequest = request.clone(authType);

    return next.handle(authRequest);
  }
}
