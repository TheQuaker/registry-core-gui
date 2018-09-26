import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {ResourcePage} from '../domain/resource-page';
import {Resource} from '../domain/resource';
import {environment} from '../../environments/environment';
import {IndexedFields} from '../domain/indexed-fields';


@Injectable({
  providedIn: 'root'
})

export class ResourceService {
  private resourceUrl = environment.API_END_POINT + '/RegistryService/resources/';
  private searchUrl = environment.API_END_POINT + '/RegistryService/search/cql/';

  private httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /** GET **/
  getResources(from: string, to: string) {
    const params: any = {from: from, to: to};
    // httpParams.set('from', from);
    // httpParams.set('to', to);
    return this.http.get<ResourcePage>(this.resourceUrl, {params})
    // return this.http.get<ResourcePage>(this.resourceUrl + `?from=${from}&to=${to}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getResourcesByType(type: string) {
    return this.http.get<ResourcePage>(this.resourceUrl + type)
      .pipe(
        catchError(this.handleError)
      );
  }

  getResource(resourceType: string, id: string) {
    return this.http.get<Resource>(this.resourceUrl + resourceType + '/' + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getIndexedFields(id: string) {
    return this.http.get<IndexedFields[]>(this.resourceUrl + 'indexed/' + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getResourcesBySearch (resourceType: string, searchTerm: string, from: string) {
    const quantity = '10';
    const sortByType = 'ASC';
    let query: string;
    if (searchTerm === '*') {
      query = '*';
    } else {
      query = `searchableArea=*${searchTerm}*`;
    }
    // const rams: any = {from: from, quantity: quantity, sortByType: sortByType};
    let params = new HttpParams();
    params = params.append('from', from);
    params = params.append('quantity', quantity);
    params = params.append('sortByType', sortByType);
    // return this.http.get<ResourcePage>(this.searchUrl + `${resourceType}/${query}/?from=0&quantity=10&sortByType=ASC`)
    return this.http.get<ResourcePage>(this.searchUrl + `${resourceType}/${query}/`, {params})
      .pipe(
        catchError(this.handleError)
      );
  }

  /** POST **/
  addResource(resource: Resource) {
    return this.http.post<Resource>(this.resourceUrl, resource, this.httpOption)
      .pipe(
      catchError(this.handleError)
    );
  }

  /** PUT **/
  updateResource(resource: Resource) {
    return this.http.put<Resource>(this.resourceUrl, resource, this.httpOption)
      .pipe(
        catchError(this.handleError)
      );
  }

  /** DELETE **/
  deleteResource(id: string) {
    return this.http.delete(this.resourceUrl + id, this.httpOption)
      .pipe(
        tap(_ => console.log(_)),
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
