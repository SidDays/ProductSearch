import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient) { }

  public title: string = 'ProductSearch';

  // Form fields
  public keywords: string = "";
  public categoryId: number = -1;
  public categories: Array<{ id: number, name: string }> = [
    {
      id: -1,
      name: "All Categories"
    },
    {
      id: 550,
      name: "Art"
    },
    {
      id: 2984,
      name: "Baby"
    },
    {
      id: 11450,
      name: "Clothing, Shoes & Accessories"
    },
    {
      id: 58058,
      name: "Computers/Tablets & Networking"
    },
    {
      id: 26395,
      name: "Health & Beauty"
    },
    {
      id: 11233,
      name: "Music"
    },
    {
      id: 1249,
      name: "Video games & Consoles"
    },
  ];
  public condition: { new: boolean, used: boolean, unspecified: boolean } = {
    new: false,
    used: false,
    unspecified: false
  };
  public shippingOption: { local: boolean, free: boolean } = {
    local: false,
    free: false
  }
  public distance: number;
  public from: { location: string, zipCode: number } = {
    location: "currentLocation",
    zipCode: null
  }

  public loadingResults: boolean = false;
  public results = [];

  public callAPI() {
    console.log("Form fields are", this.keywords, this.categoryId, this.condition, this.shippingOption, this.distance, this.from);

    // build query parameters object
    let paramsObj = {
      "keywords": this.keywords,
      "categoryId": String(this.categoryId),
    };
    if (this.condition.new) { paramsObj["conditionNew"] = "true" }
    if (this.condition.used) { paramsObj["conditionUsed"] = "true" }
    if (this.condition.unspecified) { paramsObj["conditionUnspecified"] = "true" }
    if (this.shippingOption.free) { paramsObj["freeshipping"] = "true" }
    if (this.shippingOption.local) { paramsObj["localpickup"] = "true" }
    if (this.distance) {
      paramsObj["distance"] = String(this.distance);
    } else {
      paramsObj["distance"] = "10";
    }
    if (this.from.location == "currentLocation") {
      // TODO: IP-API
      paramsObj["postalCode"] = "90007";
    } else {
      paramsObj["postalCode"] = String(this.from.zipCode);
    }

    // FIXME: Progress bar and hide results
    this.loadingResults = true;
    this.http.get('/api/findproducts', {
      params: paramsObj
    }).subscribe(function (data) {
      console.log(data);
    });
  }
}



