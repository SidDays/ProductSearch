// Get dependencies
const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

// Search results
const myAppID = 'Dhananja-Assignme-PRD-316e081a6-a75d9f0b';
app.get('/api/findproducts', function (req, res) {

  let paramsObj = {
    "OPERATION-NAME": "findItemsAdvanced",
    "SERVICE-VERSION": "1.0.0",
    "SECURITY-APPNAME": myAppID,
    "RESPONSE-DATA-FORMAT": "JSON",
    "RESTPAYLOAD": null,
    "paginationInput.entriesPerPage": 50,
    "outputSelector(0)": "SellerInfo",
    "outputSelector(1)": "StoreInfo",
  };

  /*
  http://svcs.ebay.com/services/search/FindingService/v1?OPERATIONNAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=Dhananja-Assignme-PRD-316e081a6-a75d9f0b&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=50&keywords=iphone&buyerPostalCode=90007&itemFilter(0).name=MaxDistance&itemFilter(0).value=10&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value=true&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value=true&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&itemFilter(4).name=Condition&itemFilter(4).value(0)=New&itemFilter(4).value(1)=Used&itemFilter(4).value(2)=Unspecified&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo
  */

  const keywords = req.query.keywords;
  if (keywords) {
    paramsObj["keywords"] = keywords;
  }

  const categoryId = req.query.categoryId;
  if (categoryId && categoryId != -1) {
    paramsObj["categoryId"] = categoryId;
  }

  const postalCode = req.query.postalCode;
  if (postalCode) {
    paramsObj["buyerPostalCode"] = postalCode;
  }

  let i = 0;

  const distance = req.query.distance;
  if (distance) {
    paramsObj["itemFilter(" + i + ").name=MaxDistance"];
    paramsObj["itemFilter(" + i + ").value"] = distance;
    i++;
  }

  const freeshipping = req.query.freeshipping;
  if (freeshipping) {
    paramsObj["itemFilter(" + i + ").name=FreeShippingOnly&itemFilter(" + i + ").value"] = freeshipping;
    i++;
  }

  const localpickup = req.query.localpickup;
  if (localpickup) {
    paramsObj["itemFilter(" + i + ").name=LocalPickupOnly"];
    paramsObj["itemFilter(" + i + ").value"] = localpickup;
    i++;
  }

  paramsObj["itemFilter(" + i + ").name=HideDuplicateItem"]
  paramsObj["itemFilter(" + i + ").value"] = true;
  i++;

  let j = 0;

  let condNew = req.query.conditionNew;
  if (condNew) {
    paramsObj["itemFilter(" + i + ").name"] = "Condition";
    paramsObj["itemFilter(" + i + ").value(" + j + ")"] = "New";
    j++;
  }

  let condUsed = req.query.conditionUsed;
  if (condUsed) {
    paramsObj["itemFilter(" + i + ").name"] = "Condition";
    paramsObj["itemFilter(" + i + ").value(" + j + ")"] = "Used";
    j++;
  }

  let condUnspecified = req.query.conditionUnspecified;
  if (condUnspecified) {
    paramsObj["itemFilter(" + i + ").name"] = "Condition";
    paramsObj["itemFilter(" + i + ").value(" + j + ")"] = "Unspecified";
    j++;
  }

  // HTTP Request
  axios.get('http://svcs.ebay.com/services/search/FindingService/v1', {
    params: paramsObj
  })
    .then(function (response) {

      // handle success
      // console.log(response.data);
      res.send(response.data);
    })
    .catch(function (error) {
      console.log('Error in eBay API results', error);
      res.send(error);
    })
});

// item detail
app.get('/api/itemdetail/:itemid', function (req, res) {

  // HTTP Request
  axios.get('http://open.api.ebay.com/shopping', {
    params: {
      "callname": "GetSingleItem",
      "responseencoding": "JSON",
      "appid": myAppID,
      "siteid": 0,
      "version": 967,
      "ItemID": req.params.itemid,
      "IncludeSelector": "Description,Details,ItemSpecifics",
    }
  })
    .then(function (res1) {

      // also call similar items API
      axios.get('http://svcs.ebay.com/MerchandisingService', {
        params: {
          "OPERATION-NAME": "getSimilarItems",
          "SERVICE-NAME": "MerchandisingService",
          "SERVICE-VERSION": "1.1.0",
          "CONSUMER-ID": myAppID,
          "RESPONSE-DATA-FORMAT": "JSON",
          "REST-PAYLOAD": null,
          "itemId": req.params.itemid,
          "maxResults": 20,
        }
      }).then(function (res2) {

        axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            "q": res1["data"]["Item"]["Title"],
            "cx": "003671390932228268953:rtszz2qde0i",
            "imgSize": "huge",
            "imgType": "news",
            "num": "8",
            "searchType": "image",
            "key": "AIzaSyCK6SW5O47KwVc2LD1MyUTOsberufLxBN0",
          }
        }).then(function (res3) {

          res.send({
            itemDetail: res1.data,
            similarItems: res2.data,
            productImages: res3.data,
          });
        }).catch(function (error3) {
          console.log('Error in Google Custom Search API.');
          res.send({
            itemDetail: res1.data,
            similarItems: res2.data,
          });
        });

      }).catch(function (error2) {
        console.log('Error in eBay Merchandising Service (Similar Items) API', error2);
        res.send({
          itemDetail: res1.data,
          similarItems: null,
        });
      });

    })
    .catch(function (error1) {
      console.log('Error in eBay Shopping (Item Detail) API', error1);
      res.send({
        itemDetail: null,
        similarItems: null,
      });
    });
});

app.get('/api/zipautocomplete', function (req, res) {

  const zipcode = req.query.zipcode;
  // HTTP Request
  axios.get('http://api.geonames.org/postalCodeSearchJSON', {
    params: {
      "postalcode_startsWith": zipcode,
      "username": "djcool",
      "country": "US",
      "maxRows": 5,
    }
  }).then(function (res1) {
    res.send(res1.data);
  }).catch(function (error) {
    console.log("Error in GeoNames API!");
    res.send(null);
  });
});

// Serve angular dist app
app.use(express.static(path.join(__dirname, 'dist', 'ProductSearch')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Tell Express to listen for requests (start server)
const port = process.env.PORT || '8081';
app.listen(port, function () {
  console.log('Server started on port', port);
});
