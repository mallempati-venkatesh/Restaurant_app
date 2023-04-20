import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "../model/product";
import { CommonService } from "../services/common.services";

@Component({
    selector: 'app-confirm',
    templateUrl: './order-confirmation.component.html',
    styleUrls: ['./order-confirmation.component.css']
  })
  export class OrderConfirmationComponent implements OnInit {
    orderId: number;
    getCartItems: Product[];
    subTotal = 0;
    total: string;
    tax: string;

    constructor(private router: Router, private commonService: CommonService){}
    
    ngOnInit() {
      this.commonService.cartCount(0);
      this.orderId = JSON.parse(localStorage.getItem('orderId') || '{}');
      this.getCartItems = JSON.parse(localStorage.getItem('items')  || '{}');
      this.calculateTotal();
      localStorage.removeItem('items');
      localStorage.removeItem('orderId');
    }

    // To calculate total amount
    calculateTotal(): void {
      this.subTotal =0;
      this.getCartItems.forEach((x: any) => {
        this.subTotal = this.subTotal + (x.price * x.quantity);
      });
      this.tax = (0.05*this.subTotal).toFixed(2);
      this.total = (this.subTotal + parseFloat(this.tax)).toFixed(2);
    }

    navigateToHome(): void {
      this.router.navigate(['/home']);
    }
  }