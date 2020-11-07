import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class AuthService {

  public error$: Subject<string> = new Subject<string>()

  constructor(public  http: HttpClient) {
  }

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate){
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }
  logout(): void {
    this.setToken(null);

  }

  isAuthentificated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse): any {
    const {message} = error.error.error;
    console.log(message);
    switch (message){
      case 'INVALID_FOUND':
        this.error$.next('email error')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('password error')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('email not found')
        break
      case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
        this.error$.next('too many attempts');
        break;
    }
    return throwError(error);
  }

  private setToken(response: FbAuthResponse| null): any {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
