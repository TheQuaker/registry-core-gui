import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

import {environment} from '../../environments/environment';
import {RequestOptions, ResponseContentType} from '@angular/http';

@Injectable({
  providedIn: 'root'
})

export class DumpService {
  private dumpUrl = environment.API_END_POINT + '/RegistryService/dump/';

  private httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/xml;charset=UTF-8'
    })
  };

  constructor(private http: HttpClient) {}

  getDumpFile(raw: string, schema: string, version: string, resourceTypes: string[]) {
    let params = new HttpParams();
    params = params.append('raw', raw);
    params = params.append('schema', schema);
    params = params.append('version', version);
    for (let i = 0; i < resourceTypes.length; i++) {
      params = params.append('resourceTypes', resourceTypes[i]);
    }
    return this.http.get(this.dumpUrl + '?' + params, { responseType: 'blob' })
      .pipe(
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
