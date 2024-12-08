import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpInterceptor } from '@angular/common/http';
import { Observable, Subject, throwError, of, BehaviorSubject } from 'rxjs';
import { map, mergeMap, switchMap, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserModel } from '../models/user.model';
//import { debug } from 'console';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  isLoggedIn = new BehaviorSubject(false);

  onLogin  = new Subject<any>(); // deprecated
  onLogout  = new Subject<any>(); // deprecated

  private token: string  = null;


  constructor(private http: HttpClient) {this.resolveToken();}

  resolveToken(): boolean{
    this.token = localStorage.getItem('token');
    this.isLoggedIn.next(this.token ?  true : false);
    return this.token ? true : false;
  }

  async sendGetRequest(): Promise<any>  {
      debugger
    // clear some data
    // create the payload data for the api request
    const data  = await this.http.get(environment['apiBaseUrl'] + '/menu/getmenuuserwise').toPromise();
        return data;
  }

}
