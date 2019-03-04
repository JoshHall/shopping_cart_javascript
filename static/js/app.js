// example of setting and getting sessionStorage information
// let item = {
//   'id': 101,
//   'name': 'Title',
//   'price': 3.98
// };
//
// sessionStorage.setItem('item', JSON.stringify(item));
//
// // retrieving information and changing it back into JSON
// let data = sessionStorage.getItem('item');
//
// let parsed_item = JSON.parse(data);
//
// console.log(parsed_item);





/************************************
START of loading products
************************************/

// step 1: create a callback function
function showProducts(res) {
  // create an empty string
  let html = "";

  // loop through all Products
  for (let product in res) {
    // make a new row for any iteration starting at 0, 3, 6, 9 throuw class on row to add padding
    if (product % 3 == 0) {
      html += '<div class="row top-margin-md">';
    }
    // create a card for each product with their respective information
    html += `
      <div class="col-md-4">
        <div class="card">
          <img src="${res[product].img_url}" alt="Placeholder" class="card-img">
          <div class="card-title">${res[product].name}</div>
          <div class="card-subtitle">$${res[product].price.toFixed(2)}</div>
          <div class="card-text">${res[product].description}</div>
          <button class="btn btn-success" onclick="addItem(${res[product].id})">Add To Cart</button>
        </div>
      </div>
    `
    // end the row for any iteration ending in 2, 5, 8, or if the iteration== length of the array
    if ((product + 1) % 3 == 0 || product + 1 === res.length) {
      html += '</div> <!-- end row -->';
    }

    $('#products').html(html);
  }

  // use jQuery to send string as html
}


// step 2: get a response from products.json using jQuery
$.get("../../products.json", showProducts)

/************************************
END of loading products
************************************/





/************************************
START of cart operation functions
************************************/

// create add item function to push to Cart
function addItem(id) {
  // clear sessionStorage
  // sessionStorage.clear();

  // check to see if a cart key exisits in sessionStorage
    // if it does, set a local cart variable to work with the parsed string
    // if it does not exist, set an empty array
  if (sessionStorage.getItem('cart')) {
    var cart = JSON.parse(sessionStorage.getItem('cart'));
  }
  else {
    var cart = [];
  }

  // send a response to products.json and create a callback that loops through the products and checks the product id
    // if the product id in the current iteration is the same as the id being taken in as the parameter, then push it to the cart.
  let quantity = 0;
  $.ajax({
    type: "GET",
    url: "../../products.json",
    async: false,
    success: function(res) {
      for (let product in res) {
        if (id == res[product].id) {
          cart.push(res[product]);
          break;
        }
      }
    }
  });

  // store to sessionStorage
  sessionStorage.setItem('cart', JSON.stringify(cart));

  showCart();
}


// create a removeCart function that splices the given item
function removeItem(id) {
  // get cart key from sessionStorage and parse it into object
  let cart = JSON.parse(sessionStorage.getItem('cart'));

  // loop through all items in the Cart
    // check if the id passed in is the same as the current items
    // if so, remove it and break
  for (let product in cart) {
    if (cart[product].id == id) {
      cart.splice(product, 1);
      break;
    }
  }

  sessionStorage.setItem('cart',JSON.stringify(cart));

  showCart();
}

// calculating and returning the Total
function calcTotal() {
  // get value and parse sessionStorage
  let cart = JSON.parse(sessionStorage.getItem('cart'));

  // loop through all items in the Cart
    // add each items price to Total
  // return total
  let total = 0;
  for (let product in cart) {
    total += cart[product].price;
  }
  return total.toFixed(2)
}


// updating all classes with total being displayed
function updateTotals() {
  // define a total variable from the return of calcTotal
  // insert into all classes with total
  let total = calcTotal();
  $('.total').text(`$${total}`);
}

// create a showCart method to render all items withing the cart variable
function showCart(id) {
  // get value and parse sessionStorage
  let cart = JSON.parse(sessionStorage.getItem('cart'));
  // if cart is empty set the table in the cart col-md-3 section to display none
  if (cart.length === 0) {
    $('#cart').css('display','none');
    $('#cart-checkout').html('<h1>Your Cart is Empty</h1>');
    $('.total').text('Your cart is empty');
  }
  // otherwise show table by setting display to block, loop over all items in cart and create a new row for each item
  else {
    let html = "";

    // send the proper string into the tbody section
    $('#cart').css('display','block');
    let tempArr = [];

    for (let product in cart) {
      let count = 1;

      // TODO: update count to and render quantity
      /***********************************
      for (let i in tempArr.length) {
        if (cart[product].id == tempArr[i][0]) {
          count += 33;
        }
        else {
          count = 33;
          tempArr.push(`${cart[product].id}: ${count}`);
          console.log(tempArr);
        }
      }
      *************************************/


      html += `
        <tr>
          <td>${count}</td>
          <td>${cart[product].name}</td>
          <td>$${cart[product].price}</td>
          <td>
            <button class="btn btn-danger" onclick="removeItem('${cart[product].id}')">X</button>
          </td>
        </tr>
      `
    }

    updateTotals();
    $('tbody').html(html);
  }
}

showCart();

/************************************
END of cart operation functions
************************************/
