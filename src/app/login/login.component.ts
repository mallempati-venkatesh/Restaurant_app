import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../model/user";
import { CommonService } from "../services/common.services";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent implements OnInit {
    registerForm: FormGroup;
    loginForm: FormGroup;
    loginSubmitted: boolean;
    rSubmitted: boolean;
    user: User;
    newUser: User = new User();
    error: string;

    constructor(private formBuilder: FormBuilder,
                private router: Router, private commonService: CommonService){}
    ngOnInit() {

      this.buildForm();
    }

    buildForm() {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });

      this.registerForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }


    get rFields() { return this.registerForm.controls; }
    get lFields() { return this.loginForm.controls; }


    onLoginFormSubmit() {
      this.error = "";
      this.loginSubmitted = true;
      if (this.loginForm.invalid) {
          return;
      } 
      this.user = this.loginForm.value;
      this.commonService.validateUser(this.user).subscribe(res => {
        console.log(res);
        if(res && res.length > 0) {
          localStorage.setItem('user', JSON.stringify(res[0]));
          let cartItems = JSON.parse(localStorage.getItem('items') || '{}'); 
          this.commonService.userLoggedIn(true);
          if(cartItems && cartItems.length > 0) {
            this.router.navigate(['/checkout']);
          } else {
            this.router.navigate(['/home']);
          }      
        } else {
          this.error = "Entered email / password is incorrect";
        }      
      });
    }

    onRegisterFormSubmit() {
      this.rSubmitted = true;
      if (this.registerForm.invalid) {
          return;
      }
      this.newUser = this.registerForm.value;
      this.commonService.createUser(this.newUser).subscribe(res => {
        console.log(res);
        if(res && res.insertId) {
          this.user = {
            id: res.insertId,
            name: this.newUser.name,
            email: this.newUser.email
          }
          localStorage.setItem('user', JSON.stringify(this.user));
          this.commonService.userLoggedIn(true);
        }
        
        let cartItems = JSON.parse(localStorage.getItem('items') || '{}'); 
        if(cartItems && cartItems.length > 0) {
          this.router.navigate(['/checkout']);
        } else {
          this.router.navigate(['/home']);
        }
      });

    }
  }