import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient) { }

  // Form fields
  public keywords: string = "iPhone 8"; // TODO: Remove default value
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
  public results = null;

  /** `true` if pill nav is on the Wish List, `false` if it is on Results. */
  public wishlistToggle: boolean = false;
  public wishlist = {};
  public pillActiveClass: string = "nav-link bg-dark text-white";
  public pillInactiveClass: string = "nav-link text-body";

  /** Adds an item to the wishlist if it isn't in it, removes it if it is.  */ 
  public toggleWishList(uniqueId: string): void {
    console.log("Toggling wishlist for", uniqueId);

    if (this.wishlist[uniqueId]) {
      delete this.wishlist[uniqueId];
    } else {
      this.wishlist[uniqueId] = true;
    }
  }

  public pageNumber: number = 1;

  /**
   * Sets up the Find Products API call using form fields.
   */
  public callAPI() {
    // console.log("Form fields are", this.keywords, this.categoryId, this.condition, this.shippingOption, this.distance, this.from);

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

    this.loadingResults = true;
    this.http.get('/api/findproducts', {
      params: paramsObj
    }).subscribe((jsonObj) => {
      this.loadingResults = false;
      console.log("Results json fetched:", jsonObj);

      this.results = [];
      if (jsonObj["findItemsAdvancedResponse"][0]["ack"] != "Success" || jsonObj["findItemsAdvancedResponse"][0]["searchResult"][0]["@count"] == 0) {
        // Do nothing
      } else {
        const items = jsonObj["findItemsAdvancedResponse"][0]["searchResult"][0]["item"];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          let result: any = {
            itemId: item.itemId[0],
            number: (i + 1),
            title: item.title[0],
            titleShort: (item.title[0].length > 35) ? item.title[0].trim().substring(0, 34) + "…" : item.title[0],
            price: "$" + item.sellingStatus[0].currentPrice[0].__value__,
            postalCode: (item.postalCode) ? item.postalCode[0] : 'N/A',
            seller: item.sellerInfo[0].sellerUserName[0],
            uniqueId: item.viewItemURL[0],
          }

          // gallery URL
          if (item.galleryURL) {
            result.galleryURL = item.galleryURL[0];
          }

          // shipping
          if (item.shippingInfo && item.shippingInfo[0]) {
            // console.log("Shipping info", item.shippingInfo[0]);        
            let shippingCost: string | number = "N/A";
            if (item.shippingInfo[0].shippingServiceCost && item.shippingInfo[0].shippingServiceCost[0].__value__) {
              shippingCost = item.shippingInfo[0].shippingServiceCost[0].__value__;
              if (shippingCost == 0) {
                shippingCost = "Free Shipping";
              } else {
                shippingCost = "$" + shippingCost;
              }
            }
            result.shippingCost = shippingCost;
            if (item.shippingInfo[0].shipToLocations) {
              result.shippingLocations = item.shippingInfo[0].shipToLocations[0];
            }
            if (item.shippingInfo[0].handlingTime) {
              result.handlingTime = item.shippingInfo[0].handlingTime[0];
            }
            if (item.shippingInfo[0].expeditedShipping) {
              result.expeditedShipping = item.shippingInfo[0].expeditedShipping[0];
            }
            if (item.shippingInfo[0].oneDayShippingAvailable) {
              result.oneDayShipping = item.shippingInfo[0].oneDayShippingAvailable[0];
            }
            if (item.shippingInfo[0].returnsAccepted) {
              result.returnAccepted = item.shippingInfo[0].returnsAccepted[0];
            }
          }

          // console.log(result);
          this.results.push(result);
        }
      }
    });
  }

  public toggleDetails: boolean = false; // TODO: Fix toggleDetails, poor implementation
  public itemActive = null;

  /**
   * Calls the item detail API on the backend.
   * @param itemId identifies the item.
   * @param resultIndex maps to a row in the search results to access its shipping information.
   */
  public itemDetail(itemId: number, resultIndex: number = -1): void {
    this.http.get('/api/itemdetail/' + itemId)
      .subscribe((jsonResult) => {
        console.log(jsonResult);

        const details = jsonResult["itemDetail"]["Item"];

        let item: any = {};

        // Info tab
        if (details.PictureURL) {
          item.pictureURL = details.PictureURL;
        }
        if (details.Title) {
          item.title = details.Title;
        }
        if (details.Subtitle) {
          item.subtitle = details.Subtitle;
        }
        if (details.CurrentPrice) {
          item.price = "$" + details.CurrentPrice.Value;
        }
        if (details.Location) {
          item.location = details.Location;
        }
        if (details["ReturnPolicy"]["ReturnsAccepted"]) {
          if (details["ReturnPolicy"]["ReturnsWithin"]) {
            item.returnPolicy = details["ReturnPolicy"]["ReturnsAccepted"] + " within " + details["ReturnPolicy"]["ReturnsWithin"];
          } else
            item.returnPolicy = details["ReturnPolicy"]["ReturnsAccepted"];
        }
        if (details.ItemSpecifics) {
          item.itemSpecifics = details.ItemSpecifics.NameValueList;
        } else {
          item.itemSpecifics = [];
        }

        // Shipping tab
        if (resultIndex >= 0) {
          console.log("Accessing shipping info of", this.results[resultIndex]);
          const result = this.results[resultIndex];
          if (result.shippingCost) { item.shippingCost = result.shippingCost; }
          if (result.shippingLocations) { item.shippingLocations = result.shippingLocations; }
          if (result.handlingTime) {
            const handlingTime = result.handlingTime[0];
            if (handlingTime == 0 || handlingTime == 1) {
              item.handlingTime = handlingTime + " Day";
            } else {
              item.handlingTime = handlingTime + " Days"
            }
          }
          item.expeditedShipping = result.expeditedShipping;
          item.oneDayShipping = result.oneDayShipping;
          item.returnAccepted = result.returnAccepted;
        }

        this.itemActive = item;
        this.toggleDetails = true;
        console.log(item);
      });
  }
}



