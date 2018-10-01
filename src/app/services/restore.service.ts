import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class RestoreService {
  private restoreUrl = environment.API_END_POINT + '/RegistryService/restore/';

  constructor(
    private http: HttpClient
  ) {}

  restore(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('upload', file);

    // const params = new HttpParams();

    const options = {
      // params: params,
      // headers: new HttpHeaders({
      //   'Content-Type': 'multipart/form-data',
      //   'Accept': 'application/xml'
      // }),
      reportProgress: true,
    };

    const req = new HttpRequest('POST', this.restoreUrl, file, options);
    return this.http.request(req).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
