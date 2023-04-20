import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "../model/product";
import { User } from "../model/user";
import { CommonService } from "../services/common.services";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
  })
  export class CartComponent implements OnInit {

    cart: Product[];
    subTotal = 0;
    total: string;
    tax: string;
    user: User;
    getCartItems: Product[];
    emptyCart: boolean;

    constructor(private httpClient: HttpClient, 
                private commonService: CommonService,
                private router: Router) { }

    ngOnInit() {
      this.emptyCart = false;
      this.user = JSON.parse(localStorage.getItem("user") || '{}');
      this.getCartItems = JSON.parse(localStorage.getItem('items')  || '{}');
      if(this.getCartItems && this.getCartItems.length > 0) { 
        this.calculateTotal();
      } else {
        this.emptyCart = true;
      }

    }

    // navigate to checkout or login
    navigateToCheckout() {
      if(this.user && this.user.name && this.user.email) {
        this.router.navigate(['/checkout']);
      } else {
        this.router.navigate(['/login']);
      }
    }

    // To calculate total amount
    calculateTotal(): void {
      
      this.cart = this.getCartItems;
      this.subTotal =0;
      this.cart.forEach((x: any) => {
        this.subTotal = this.subTotal + (x.price * x.quantity);
      });
      this.tax = (0.05*this.subTotal).toFixed(2);
      this.total = (this.subTotal + parseFloat(this.tax)).toFixed(2);
    }

    // Delete Product
    deleteProduct(id: number) {
      let cartItems = this.cart.filter((x:any) => x.id !== id);
      this.commonService.cartCount(cartItems.length);
      this.cart = cartItems;
      this.calculateTotal();
      localStorage.setItem("items", JSON.stringify(cartItems));
    }

    // update quantity
    quantityUpdate(type: number, productId: number, quantity: number) {
      if(type == 1){
        this.cart.forEach((element: any, index: any) => {
          if(element.id == productId){
            this.cart[index].quantity = element.quantity + 1;
          }
        });
      } else {
        this.cart.forEach((element: any, index: any) => {
          if(element.id === productId){
            if(element.quantity === 1) {
              this.cart[index].quantity = 1;
            } else {
              this.cart[index].quantity = element.quantity - 1;
            }
          }
        });

      }   
      localStorage.setItem('items', JSON.stringify(this.cart));        
      this.calculateTotal();
    }
  }