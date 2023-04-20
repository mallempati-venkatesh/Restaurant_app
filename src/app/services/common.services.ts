import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { Order } from '../model/order';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    private itemCount = new BehaviorSubject(0);
    private message = new BehaviorSubject(false);
    count: Observable<number> = this.itemCount.asObservable();
    isLoggedIn: Observable<boolean> = this.message.asObservable();
    url = localStorage.getItem('url');
    constructor(private httpClient: HttpClient) { }

    // get products data from DB
    getItems(): Observable<Product[]> {
        return this.httpClient.get<Product[]>(`${this.url}/products/getAllProducts`);
    }

    // create new user
    createUser(request: User): Observable<any>{
        return this.httpClient.post<any>(`${this.url}/user/addUser`, request);
    }

    // validate user
    validateUser(userRequest: User): Observable<any>{
        return this.httpClient.post<any>(`${this.url}/user/validate`, userRequest);
    }

    // create order
    createOrder(orderRequest: Order): Observable<any>{
        return this.httpClient.post<any>(`${this.url}/orders/createOrder`, orderRequest);
    }

    // cart count
    cartCount(count: number) {
        this.itemCount.next(count);
    }

    userLoggedIn(isLoggedIn: boolean) {
        this.message.next(isLoggedIn);
    }
}