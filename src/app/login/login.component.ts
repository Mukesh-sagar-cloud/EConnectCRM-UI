import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../_auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  constructor(
    private authService: AuthService
    
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
debugger
    console.log(form.value.requestSource,form.value.username,form.value.password); // Access the form values here
    this.authService.login(form.value.requestSource,form.value.username,form.value.password).subscribe({
      next: data => {
        debugger
        console.log(data);
        // this.storageService.saveUser(data);

        // this.isLoginFailed = false;
        // this.isLoggedIn = true;
        // this.roles = this.storageService.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        debugger
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });

    // this.authService.login(form.value.requestSource,form.value.username,form.value.password).then(
    //   data => {
    //     debugger
    //     console.log(data);
    //     // if(data=='User already login.'){
    //     //   this.processing = false;
    //     //   this.openModal('custom-modal-1');
    //     // }
    //     // else{if (data) {this.handleLoginSuccess();} 
    //     //            else{this.handleLoginError();}
    //     // }
        
    //   },
    //   err => {
    //     console.log('---- ERROR ---- ');
    //     console.log(err);
    //     // this.handleLoginError();
    //   });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
