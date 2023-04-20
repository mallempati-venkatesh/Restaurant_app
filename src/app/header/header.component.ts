import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CommonService } from "../services/common.services";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
  })
  export class HeaderComponent implements OnInit {
    count: number = 0;
    isLoggedIn = false;
    isLogout: boolean;
    userName: string;

      constructor(private router: Router, private commonService: CommonService) {
      }
      ngOnInit() {
        this.commonService.count.subscribe(count => this.count = count);
        this.commonService.isLoggedIn.subscribe( res => {
          if(res) {
            this.getUserDetails();
          }
        });
        let cartItems = JSON.parse(localStorage.getItem('items') || '{}'); 
        if(cartItems && cartItems.length > 0) {
          this.count = cartItems.length;
        }
        this.getUserDetails();
      }

      getUserDetails() {
        let user = JSON.parse(localStorage.getItem('user') || '{}');
        if(user && user.email && user.name) {
          this.isLoggedIn = true;
          this.userName = user.name;
        }
      }

      // navigate to Login
      navigateToLogin(): void {
        this.router.navigate(['/login']);
      }

      // logout 
      logout() {
        this.isLogout = true;
        this.isLoggedIn = false;
        localStorage.removeItem('user');
        this.router.navigate(['/home']);
      }

  }