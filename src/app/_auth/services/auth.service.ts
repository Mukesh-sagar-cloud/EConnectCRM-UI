import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpInterceptor,HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError, of, BehaviorSubject } from 'rxjs';
import { map, mergeMap, switchMap, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserModel } from '../models/user.model';
//import { debug } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = new BehaviorSubject(false);

  onLogin  = new Subject<any>(); // deprecated
  onLogout  = new Subject<any>(); // deprecated

  private token: any;
  private loginid: string  | null = null;
  private institutecd: string  | null = null;
  private designation: string  | null = null;
  private refreshtoken: string  | null = null;
  private userData: UserModel | null = null;
 
  constructor(private http: HttpClient) {}
  // constructor(private http: HttpClient) {
  //   // try and find out if there was a localstorage token was set
  //   this.resolveToken();
  // }
  // const httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };

  myObject: any;
  myObjectrefreshToken: any; 
  validateTokenOnServer() {

    const RefreshData  = {
      'token' : localStorage.getItem('token'),
      'refreshToken' : localStorage.getItem('refreshtoken')
    };

    return this.http.post(environment['apiBaseUrl'] + '/users/Refresh',RefreshData)
      .pipe(
        map(data => {
          debugger;
          //this.setDataAfterLogin(data);
          this.myObjectrefreshToken=data;
          return this.myObjectrefreshToken['refreshToken'] ? this.myObjectrefreshToken['refreshToken'] : false;;
          }
        ),
        tap((status) => { if (status) {
          this.myObject=status;
           this.userData  = this.myObject['id']; } }),
        tap((status) => { if (!status) { this.isLoggedIn.next(false); } }),
        catchError(err => {
          return of(false);
        }),
      );
  }

  // check if localstorage token was set
  // if so, set the token in the service
  // and set the login status
  resolveToken(): boolean {
    this.token = localStorage.getItem('token');
    this.isLoggedIn.next(this.token ?  true : false);
    return this.token ? true : false;
  }

  getToken(): string {
    return this.token;
  }

  hasToken(): boolean  {
    return this.getToken() ? true : false;
  }
  datamessage: any;
  async logout() {
    debugger
        const logoutData  = {
          'Id' : Number(localStorage.getItem('loginid')),
          'RefreshToken' : localStorage.getItem('refreshtoken'),
          'RequestSource':'web'
        };

        const data  = await this.http.post(environment['apiBaseUrl'] + '/users/logout' , logoutData).toPromise();
        this.datamessage=data;
        if(this.datamessage['message']=="logout"){
        this.clearData();
        this.isLoggedIn.next(false);
        return true;
        }
        else{
          return false;
        }
  }
  output : any;

  login(requestSource: any, username: any,password:any): Observable<any> {
    return this.http.post(
      environment['apiBaseUrl'] + '/api/account/authenticate',
      {
          "username": "superadmin@gracesoft.com",
          "password": "SuperAdmin",
          "requestSource": "mobile"
      },
      {
        withCredentials:true,
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

//   async login({ username, password, shortname }: 
//     { username: any; password: any; shortname: any }): Promise<any> {

//   //async login({ username , password ,forcefully }): Promise<any>  {
//     // clear some data
//     this.clearData();
// debugger
//     // create the payload data for the api request
//     const loginData  = {
//       // 'Username' : username,
//       // 'Password' : password,
//       // 'RequestSource':'web',
//       'username': "superadmin@gracesoft.com",
//       'password': "SuperAdmin",
//       'requestSource': "mobile"
//       // 'DeviceDetail':this.myBrowser() ,
//       // 'forcefullylogin':forcefully
//     };
//     const data  = await this.http.post(environment['apiBaseUrl'] + '/api/login/authenticate' , loginData).toPromise();
//     debugger
//     this.output=data;
//     return  this.output['username'];
//     // if(data['message']=='User already login.'){
//     //   ///open popup Do You Want to login Forcefully?
//     //   return 'User already login.';
//     // }
//     // else{
//     // // this part only gets executed when the promise is resolved
//     // if (data['token'] && data['username']) {
//     //     this.setDataAfterLogin(data);
//     //     this.isLoggedIn.next(true); // how do I unit test this?
//     //     return data['username'];
//     // } else {return false;}
//     // }
//   }

  clearData() {
    this.userData  = null;
    this.token  = null;
    localStorage.clear();
  }

  // getUserData(): UserModel {
  //   return this.userData;
  // }

  // private setDataAfterLogin(data) {
  //   debugger
  //   this.token  = data['token'];
  //   this.refreshtoken  = data['refreshToken'];
  //   // store some user data in the service
  //   this.userData  = data['username'];
  //   this.loginid = data['id'];
  //   this.institutecd = data['institutecd'];
  //   this.designation = data['designation'];
    
  //   // store some data in local storage (webbrowser)
  //   localStorage.setItem('token' , this.token);
  //   localStorage.setItem('loginid' , this.loginid);
  //   localStorage.setItem('refreshtoken' , this.refreshtoken);
  //   localStorage.setItem('usermeta' , JSON.stringify(this.userData));
  //   localStorage.setItem('institutecd' , JSON.stringify(this.institutecd));
  //   localStorage.setItem('designation' , JSON.stringify(this.designation));
  // }
  // myBrowser() { 
  //   if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {return 'Opera';}
  //   else if(navigator.userAgent.indexOf("Chrome") != -1 ){return 'Chrome';}
  //   else if(navigator.userAgent.indexOf("Safari") != -1){return 'Safari';}
  //   else if(navigator.userAgent.indexOf("Firefox") != -1 ){return 'Firefox';}
  //   else if((navigator.userAgent.indexOf("MSIE") != -1 )){return 'IE'; }
  //   else {return 'unknown';}
  // }

//   async sendGetRequest(): Promise<any>  {
    
//   // clear some data
//   // create the payload data for the api request
//   const data  = await this.http.get(environment['apiBaseUrl'] + '/users/getmenuuserwise?UserId='+localStorage.getItem('loginid')+'').toPromise();
//       return data;
// }

}
