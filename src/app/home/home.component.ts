import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../services/common.services";
import { Product } from "../model/product";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
  })
  export class HomeComponent implements OnInit {
    productsData: Product[];
    cartItems= [];
    allItems: Product[];

    constructor(private httpClient: HttpClient, private service: CommonService) { }

    ngOnInit(){
      this.getProducts();
    }

    // Get products
    getProducts(): void {
      this.service.getItems().subscribe(data =>{
        this.allItems = data;
        this.productsData = data;
      })
    }

    // add to cart
  addToCart(product: Product): void {
    window.scroll(0,0);
    product.quantity = 1;
      let cartItems = JSON.parse(localStorage.getItem('items') || '{}'); 
      if(cartItems && cartItems.length > 0) {
        let item = cartItems.filter((x:Product) => x.id === product.id);
        if(item && item.length > 0) {
          cartItems.forEach((element:any) => {
            if(element.id === item[0].id) {
              element.quantity = element.quantity + 1;
            }
          });
        } else {
            cartItems.push(product);
        }
      }
      else {
        if(cartItems.length === undefined) {
          cartItems = [];
          cartItems.push(product);
        } 
      }
      this.service.cartCount(cartItems.length);
      localStorage.setItem("items", JSON.stringify(cartItems));
    }

    // Load Items by category
    loadItemsByCategory(id: number): void {
      if(id > 0) {
        this.productsData = this.allItems.filter(x=> x.category === id);
      } else {
        this.productsData = this.allItems;
      }
    }
  }