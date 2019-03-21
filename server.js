// Get dependencies
const express = require('express');
const app = express();

// Test
app.get('/test', function (req, res) {
  res.send('This was a sample request');
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