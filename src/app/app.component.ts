import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = 'ProductSearch';
  public results = [];

  public keywords = "";

  public callAPI() {
    //  console.log("hello World");
    console.log(this.keywords);
  }
}



