import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {ResourceTypePage} from '../domain/resource-type-page';
import {ResourceType} from '../domain/resource-type';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceTypeService {

  constructor(private http: HttpClient) {}

   // private resourceTypeUrl = 'http://aleka.athenarc.gr:8080/arc-expenses-service/resourceType/';
   private resourceTypeUrl = environment.API_END_POINT + '/RegistryService/resourceType/';

  /** GET **/
  getResourceTypes() {
    return this.http.get<ResourceTypePage>(this.resourceTypeUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getResourceType(name: string) {
    return this.http.get<ResourceType>(this.resourceTypeUrl + name)
      .pipe(
        catchError(this.handleError)
      );
  }

  /** POST **/
  addResourceType(resourceType: ResourceType) {
    return this.http.post(this.resourceTypeUrl, resourceType)
      .pipe(
        catchError(this.handleError)
      );
  }

  /** DELETE **/
  deleteResourceType(name: string) {
    return this.http.delete(this.resourceTypeUrl + name)
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
