import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProductSearch';
  results = [];

  public keywords = "";

  callAPI() {
    //  console.log("hello World");
    console.log(this.keywords);
  }
}



