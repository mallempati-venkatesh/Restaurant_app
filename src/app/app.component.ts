import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app';
  constructor(){
    const url = 'http://localhost:3000/api';
    localStorage.setItem('url', url);
  }
}
