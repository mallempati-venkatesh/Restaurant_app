import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Product } from "../model/product";
import { Order } from "../model/order";
import { CommonService } from "../services/common.services";
import { User } from "../model/user";
import { Payment } from "../model/payment";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
  })
  export class CheckoutComponent implements OnInit {
    constructor(private formBuilder: FormBuilder, 
                private router: Router,
                private commonService: CommonService){}

    paymentForm: FormGroup;
    displayMessage: string;
    isSubmit: boolean;
    years: number[];
    cart: Product[];
    subTotal = 0;
    total: string;
    tax: string;
    user: User;
    getCartItems: Product[];

    ngOnInit() {
      this.user = JSON.parse(localStorage.getItem("user") || '{}');
      this.getCartItems = JSON.parse(localStorage.getItem('items')  || '{}');
      this.buildForm();
      this.generateYears();
      this.calculateTotal();
      
    }
  
    buildForm() {
      this.paymentForm = this.formBuilder.group({
        name: ['', [Validators.required,Validators.minLength(1),Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
        cardNumber: ['', [Validators.required,Validators.minLength(16),Validators.min(1111111111111111),Validators.max(9999999999999999)]],
        month: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(2),Validators.min(1),Validators.max(12)]],
        year: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.min(1111),Validators.max(9999)]],
        cvv: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(4),Validators.min(111),Validators.max(9999)]]
      });
    }

    get f() { return this.paymentForm.controls; }

    // Year
    generateYears(): void {
      let year= new Date().getFullYear();
      let range = [];
      range.push(year);
      for(let i=0; i<10; i++) {
        range.push(year+i);
      }
      this.years = range;
    }

    // submit form
    onSubmit() {
      this.displayMessage = "";
      this.submitForm();
    }

    submitForm() {
      this.isSubmit = true;
    if (this.paymentForm.invalid) {
        return;
    }
    const orderRequest: Order = {
      customerId: this.user.id,
      totalAmount: parseFloat(this.total),
      tax: parseFloat(this.tax),
      lineItems: this.getCartItems,
      payment: this.paymentForm.value
    }
    console.log("Order Request: " + orderRequest);

    this.commonService.createOrder(orderRequest).subscribe(res => {
      if(res && res.insertId) {
        localStorage.setItem('orderId', res.insertId);
        this.router.navigate(['/summary']);
      } else {
        this.displayMessage = "Payment Failed!";
      }
    });
    }

    // To calculate total amount
    calculateTotal(): void {
      let getCartItems = JSON.parse(localStorage.getItem('items')  || '{}');
      this.cart = getCartItems;
      this.subTotal =0;
      this.cart.forEach((x: any) => {
        this.subTotal = this.subTotal + (x.price * x.quantity);
      });
      this.tax = (0.05*this.subTotal).toFixed(2);
      this.total = (this.subTotal + parseFloat(this.tax)).toFixed(2);
    }

  }