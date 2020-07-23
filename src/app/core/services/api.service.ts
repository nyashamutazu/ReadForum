import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(path: string, params?: HttpParams = new HttpParams()): Observable<any> {
    if (params) {
      return this.http
      .get<{ message: string; responeData: any }>(
        `${environment.api_url}${path}`,
        {params}
      )
      .pipe(catchError(this.formatErrors));
    } else {
      return this.http
      .get<{ message: string; responeData: any }>(
        `${environment.api_url}${path}`
      )
      .pipe(catchError(this.formatErrors));
    }

  }

  put(path: string, data: any): Observable<any> {

    return this.http
      .put<{ message: string; responeData: any }>(
        `${environment.api_url}${path}`,
        data
      )
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, data?: any): Observable<any> {
    console.log('In API', path, data);
    return this.http
      .post<{ message: string; responseData: any }>(
        `${environment.api_url}${path}`,
        data
      )
      .pipe(catchError(this.formatErrors));
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete<{ message: string }>(`${environment.api_url}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any) {
    console.log('Error,', error);
    return throwError(error.error);
  }
}
