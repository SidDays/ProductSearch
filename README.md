# Product Search

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5.

## Features

### Basic Search Form
- [x] Keyword, Category and Distance Placeholder 
- [ ] Form displayed properly 
- [x] The drop-down list should contain all categories 
- [ ] Zip Code edit box must be disabled when choosing “Current location” radio and enabled 
when selecting “Other” 
- [ ] Validation for the search inputs and the error message(s) 
- [ ] Validation for zip code 
- [ ] “Clear” button resets the search form to the initial state and clears results area 
- [ ] Disable and enable the “Search” button appropriately 
- [ ] Obtain user location 
- [ ] Zip Code Autocomplete

### Results
- [x] Wish List 
- [x] Product clickable 
- [x] Tooltip and Restricting Product Name 
- [x] Details button enabled, disabled appropriately and navigate to product details for last clicked product 
- [ ] Pagination 
- [x] Highlighting the selected row 
- [x] No missing cell/column 

### Wish List
- [x] Image, Title, Price, Shipping, Seller, Wishlist
- [x] Gold icon/black (y/n)
- [x] Add from search list/detail 
- [x] Deletion from search list/wish list/detail 
- [x] Display total shopping cost correctly 
- [x] Enable/Disable detail button correctly navigate to product details for last clicked product

### Product Details
- [ ] Animation: slides in from the left
- [x] Product name above tabs 

#### Product tab
- [x] Show every row in the table in the specified format
- [x] Show “Product Image” modal correctly with all images - modal, carousel, black background, click on image to maximize
- [ ] Carousel animations

#### Photos tab 
- [x] Set up Google Custom Search engine API
- [x] Display all photos as shown in the video in a Masonrysstyle laout
- [x] Photos can be opened in a new tab

#### Shipping tab 
- [x] Table display information in the specified format 
- [x] Ticks and crosses displayed correctly

#### Seller tab 
- [x] Table display information in the correct manner 
- [x] Display seller popularity using circle progress bar correctly
- [x] Display Feedback Rating Star correctly
- [x] Click on store - links to store

#### Similar Products tab 
- [x] Dropdowns with proper categories and disabled/enabled correctly
- [x] Display products in the correct way (including clickable names and proper images)
- [x] Show More/Less works
- [x] Sort by: default, product name, days left, price, shipping cost; Sort order: ascending, descnding
- [x] Similar products API call

#### Buttons
- [x] List button display and navigate to results/wish list properly
- [x] Wish List button
- [ ] Facebook button

### Progress bars, No records messages
- [x] Progress bar
- [ ] No records messages

### Responsive
- [ ] In mobile browsers, all of the pages should be the same as screenshots provided in description document 
- [ ] In mobile browsers, all search, wish list, and Facebook functions must work 
- [ ] In mobile browsers, the animation must work

### Theme
- [x] Dark theme

### Use of Angular 
- [x] Animation must be implemented with Angular
- [ ] Autocomplete must be implemented with Angular

### Use of Bootstrap 
- [x] The app should be implemented using Bootstrap

### Use of GAE/AWS/Azure 
- [ ] Node.js script must be deployed on GAE/AWS/Azure, and an additional link should be added to the list of homework, with a format similar to the following:

`http://xxx.appspot.com/[path]?[list_of_the_parameters_and_sample_values]`
Or

`http://xxx.elasticbeanstalk.com/[path]?[list_of_the_parameters_and_sample_values]`
Or 

`http://xxx.azurewebsites.net/[path]?[list_of_the_parameters_and_sample_values]`


### Additional Requirements 
- [x] Most API requests must be made on server side. Only ip-api can be called on client side
- [x] The window should not reload for any kind of data request. All transactions are asynchronous
- [x] The program must work in Chrome and Firefox on desktop, and Safari and Chrome on mobile devices

## Development server

Run `npm start` to concurrently run an angular dev and a nodejs server, which automatically opens `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
