import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  trigger,
  state,
  style,
  animate,
  group,
  transition,
} from '@angular/animations';
import * as moment from 'moment';
import * as customSearchSample from '../assets/customSearchSample.json';

@Component({
  selector: 'app-root',
  animations: [
    trigger('slideInOut2', [
      state('in', style({
        'max-height': '500px', 'opacity': '1', 'visibility': 'visible'
      })),
      state('out', style({
        'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
      })),
      transition('in => out', [group([
        animate('400ms ease-in-out', style({
          'opacity': '0'
        })),
        animate('600ms ease-in-out', style({
          'max-height': '0px'
        })),
        animate('700ms ease-in-out', style({
          'visibility': 'hidden'
        }))
      ]
      )]),
      transition('out => in', [group([
        animate('1ms ease-in-out', style({
          'visibility': 'visible'
        })),
        animate('600ms ease-in-out', style({
          'max-height': '500px'
        })),
        animate('800ms ease-in-out', style({
          'opacity': '1'
        }))
      ]
      )])
    ]),
    trigger('slideInLeftOutRight', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('500ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0%)'}),
        animate('500ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  animationState = 'in';

  toggleShowDiv() {
      console.log(this.animationState);
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
      console.log(this.animationState);
  }

  public wishlist;
  public totalShopping: number;
  ngOnInit(): void {
    // load wishlist from localstorage
    if (localStorage.getItem("wishlist")) {
      this.wishlist = JSON.parse(localStorage.getItem("wishlist"));
    } else {
      this.wishlist = { };
    }
    if (localStorage.getItem("totalShopping")) {
      this.totalShopping = parseInt(localStorage.getItem("totalShopping"));
    } else {
      this.totalShopping = 0;
    }
    

  }

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
  public results = null;

  /**
   * Reset the form fields,
   * clear all validation errors if present,
   * switch the view to the results tab and
   * clear the results area.
   */
  public clearEverything(): void {
    this.keywords = "";
    this.categoryId = -1;
    this.condition = {
      new: false,
      used: false,
      unspecified: false
    };
    this.shippingOption = {
      local: false,
      free: false
    }
    this.distance = null;
    this.from = {
      location: "currentLocation",
      zipCode: null
    }
    this.wishlistToggle = false;
    this.results = null;
    this.toggleDetails = false;
  }

  public openProductImagesModal(content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /** `true` if pill nav is on the Wish List, `false` if it is on Results. */
  public wishlistToggle: boolean = false;
  public isWishlistEmpty(): boolean {
    for (const prop in this.wishlist) {
      if (this.wishlist.hasOwnProperty(prop))
        return false;
    }

    return true;
  }
  public pillActiveClass: string = "nav-link bg-dark text-white";
  public pillInactiveClass: string = "nav-link text-body";

  /**
   * Adds an item to the wishlist if it isn't in it, removes it if it is.
   * 
   * @param uniqueId The item's unique URL that identifies it. **required** for both add/delete!
   * @param resultIndex The result that corresponds to this item, if adding from results.
   * @param isItemActive `true` if adding from item detail page.
   */ 
  public toggleWishList(uniqueId: string, resultIndex: number = -1, isItemActive: boolean = false): void {

    if (this.wishlist[uniqueId]) {
      // Remove item if already in wishlist
      delete this.wishlist[uniqueId];
    } else {
      if (resultIndex !== -1) {
        const result = this.results[resultIndex];
        this.wishlist[uniqueId] = result;

        console.log("Added item", result, " to wishlist from results.");
      }
      else if (isItemActive) {
        // Put active item in wishlist
        this.wishlist[uniqueId] = this.itemActive;

        console.log("Added item", uniqueId, " to wishlist from item detail.");
      }
      else {
        console.warn("Tried to illegally add item", uniqueId,"to the wishlist.");
      }
    }

    // Either way, recalculate totalShopping
    let shopping = 0;
    for (const prop in this.wishlist) {
      if (this.wishlist.hasOwnProperty(prop)) {
        const price = parseFloat(this.wishlist[prop].price.slice(1));
        shopping += price;
      }
    }
    this.totalShopping = shopping;

    // Sync wishlist with localStorage
    localStorage.setItem("wishlist", JSON.stringify(this.wishlist));
    localStorage.setItem("totalShopping", this.totalShopping.toString());

    // console.log("wishlist:", this.wishlist);
    // console.log("totalShopping:", this.totalShopping);
  }

  public pageNumber: number = 1;

  /**
   * Sets up the Find Products API call using form fields.
   */
  public callAPI() {
    this.loadingResults = true;
    this.wishlistToggle = false;

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
            index: i,
            number: (i + 1),
            title: item.title[0],
            price: "$" + item.sellingStatus[0].currentPrice[0].__value__,
            postalCode: (item.postalCode) ? item.postalCode[0] : 'N/A',
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
          
          // seller
          if (item.sellerInfo && item.sellerInfo[0]) {
            if (item.sellerInfo[0].sellerUserName) {
              result.sellerUserName = item.sellerInfo[0].sellerUserName[0];
            } else {
              result.sellerUserName = "N/A";
            }
          }

          this.results.push(result);
        }
      }

      // console.log("results:", this.results);
      this.toggleDetails = false;
    });
  }

  public toggleDetails: boolean = false;
  public itemActive = null;
  public loadingItem: boolean = false;

  /**
   * Calls the item detail API on the backend.
   * 
   * Since shipping info is collected during the first API call,
   * this function MUST access its data (and thus can be called from result / wishlist only.)
   * 
   * @param itemId identifies the item.
   * @param resultIndex maps to a row in the search results to access its shipping information.
   * @param wishlistUniqueId maps to a row in the wishlist to access its shipping information.
   */
  public itemDetail(itemId: number, resultIndex?: number, wishlistUniqueId?: string): void {

    this.loadingItem = true;
    this.toggleDetails = true;

    this.http.get('/api/itemdetail/' + itemId)
      .subscribe((jsonResult) => {
        console.log('/api/itemdetail/' + itemId + ' fetched:', jsonResult);

        const details = jsonResult["itemDetail"]["Item"];

        let item: any = { };

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

        // Photos tab
        item.images = [[], [], []];
        let imagesFromAPI = [];
        if (jsonResult["productImages"] && jsonResult["productImages"]["images"]) {
          imagesFromAPI = jsonResult["productImages"]["items"];
        } else {
          // FIXME: Remove fallback images in final version
          console.warn("No images loaded. Check if Google Custom Search API has failed! Using default images as fallback.");
          imagesFromAPI = customSearchSample["items"];
        }

        imagesFromAPI.forEach((itemObj, index) => {
          item.images[index % 3].push(itemObj.link);
        });

        // Shipping tab
        let shippingInfoSource = null;
        if (resultIndex != null && resultIndex >= 0) {
          shippingInfoSource = this.results[resultIndex];
        } else if (wishlistUniqueId != null) {
          shippingInfoSource = this.wishlist[wishlistUniqueId];
        }

        if (shippingInfoSource) {
          console.log("Accessing shipping info of", shippingInfoSource);
          if (shippingInfoSource.shippingCost) { item.shippingCost = shippingInfoSource.shippingCost; }
          if (shippingInfoSource.shippingLocations) { item.shippingLocations = shippingInfoSource.shippingLocations; }
          if (shippingInfoSource.handlingTime) {
            const handlingTime = shippingInfoSource.handlingTime[0];
            if (handlingTime == 0 || handlingTime == 1) {
              item.handlingTime = handlingTime + " Day";
            } else {
              item.handlingTime = handlingTime + " Days"
            }
          }
          item.expeditedShipping = shippingInfoSource.expeditedShipping;
          item.oneDayShipping = shippingInfoSource.oneDayShipping;
          item.returnAccepted = shippingInfoSource.returnAccepted;

          // Still save unique ID
          item.uniqueId = shippingInfoSource.uniqueId;
        }

        // Seller tab
        if (details.Seller) {
          const seller = details.Seller;
          item.sellerUserName = seller.UserID;
          item.feedbackRatingStar = seller.FeedbackRatingStar;
          item.feedbackScore = seller.FeedbackScore;
          if (item.feedbackScore && item.feedbackRatingStar) {
            item.feedbackRatingStarType = (item.feedbackScore > 5000) ? "stars" : "star_border";
            item.feedbackRatingStarStyle = {
              "vertical-align": "middle",
            };

            switch (item.feedbackRatingStar) {
              case "Yellow":
              case "YellowShooting":
                item.feedbackRatingStarStyle.color = "yellow";
                break;

              case "Blue":
                item.feedbackRatingStarStyle.color = "blue";
                break;

              case "Turquoise":
              case "TurquoiseShooting":
                item.feedbackRatingStarStyle.color = "turquoise";
                break;

              case "Purple":
              case "PurpleShooting":
                item.feedbackRatingStarStyle.color = "purple";
                break;

              case "Red":
              case "RedShooting":
                item.feedbackRatingStarStyle.color = "red";
                break;

              case "Green":
              case "GreenShooting":
                item.feedbackRatingStarStyle.color = "green";
                break;

              case "SilverShooting":
              item.feedbackRatingStarStyle.color = "silver";
                break;

              default:
                break;
            }
          }
          item.positiveFeedbackPercent = seller.PositiveFeedbackPercent;
          item.topRatedSeller = seller.TopRatedSeller;
        }
        if (details.Storefront) {
          const storefront = details.Storefront;
          item.storeName = storefront.StoreName;
          item.storeURL = storefront.StoreURL;
        }

        // Similar Items Tab
        const similarItems = jsonResult["similarItems"]["getSimilarItemsResponse"]["itemRecommendations"]["item"];
        if(similarItems){
          // console.log("Similar items", similarItems);
          
          similarItems.forEach((element, index) => {
            element.index = index;
            element.daysLeft = moment.duration(element.timeLeft).days();
          });

          item.similarItems = similarItems;
          item.similarItemsLength = (similarItems.length > 5) ? 5 : similarItems.length;
        }

        this.itemActive = item;
        console.log("itemActive:", this.itemActive);

        this.loadingItem = false;
      });
  }

  // sort results by product name
  public sortAscOrDesc: string = "0";
  public sortType: string = "0";
  public sortSimilarItemsOrder(orderType) {

    console.log("Sorting by order", orderType);
    const sortAscOrDesc = this.sortAscOrDesc;

    let sortOrder = function (n1, n2): any {
      let result = n1.index - n2.index;
      return (sortAscOrDesc == "0") ? result : -result;
    }

    switch (orderType) {

      case "0": break; // default

      case "1": // name
        sortOrder = function (n1, n2) {
          const str1: string = n1.title, str2: string = n2.title;
          let result = str1.localeCompare(str2);
          return (sortAscOrDesc == "0") ? result : -result;
        }
        break;

      case "2": // daysleft
        sortOrder = function (n1, n2) {
          let result = n1.daysLeft - n2.daysLeft;
          return (sortAscOrDesc == "0") ? result : -result;
        }
        break;

      case "3": // price
        sortOrder = function (n1, n2) {
          const p1: number = n1.buyItNowPrice.__value__,
            p2: number = n2.buyItNowPrice.__value__;
          let result = p1 - p2;
          return (sortAscOrDesc == "0") ? result : -result;
        }
        break;

      case "4": // shipping cost
        sortOrder = function (n1, n2) {
          const s1: number = n1.shippingCost.__value__,
            s2: number = n2.shippingCost.__value__;
          let result = s1 - s2;
          return (sortAscOrDesc == "0") ? result : -result;
        }
        break;
    }

    this.itemActive.similarItems.sort(sortOrder);
  }
}
