// Get dependencies
const express = require('express');
const app = express();
const axios = require('axios');

// Test
app.get('/api/test', function (req, res) {
  res.send('This was a sample request');
});

// Search results
const myAppID = 'Dhananja-Assignme-PRD-316e081a6-a75d9f0b';
app.get('/api/findproducts', function (req, res) {

  const keywords = req.query.keywords;

  // HTTP Request
  axios.get('http://svcs.ebay.com/services/search/FindingService/v1', {
    params: {
      "OPERATION-NAME": "findItemsAdvanced",
      "SERVICE-VERSION": "1.0.0",
      "SECURITY-APPNAME": myAppID,
      "RESPONSE-DATA-FORMAT": "JSON",
      "RESTPAYLOAD": null,
      "paginationInput.entriesPerPage": 10,
      "keywords": keywords
    }
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

// Test
// app.get('*', function (req, res) {
//   res.send('All requests go here by default');
// });

// Tell Express to listen for requests (start server)
const port = process.env.PORT || '3000';
app.listen(port, function () {
  console.log('Server started on port', port);
});