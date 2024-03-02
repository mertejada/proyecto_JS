let productId = new URLSearchParams(window.location.search).get("id"); //consigo el id del producto de la url

//FUNCION PARA MOSTRAR LA INFORMACION DEL PRODUCTO
//-----------------------------------------------
function displayProductInfo(product) {
  let productInfo = document.getElementById("product-info");
  let productLikes = 0;
  let productDislikes = 0;
  productInfo.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "text-center",
    "p-4"
  );

  if (localStorage.getItem("likedItems")) {
    //si hay productos con me gusta en el localStorage
    let likedItems = JSON.parse(localStorage.getItem("likedItems"));
    productLikes = likedItems[product.id] || 0; //cojo el valor de me gusta del producto o 0
  }

  if (localStorage.getItem("dislikedItems")) {
    let dislikedItems = JSON.parse(localStorage.getItem("dislikedItems"));
    productDislikes = dislikedItems[product.id] || 0;
  }

  productInfo.innerHTML = `
        <h1 class="text-3xl font-bold p-10">${product.title}</h1> 
        <img src="${product.image}" alt="${product.title} id="product-img" class="w-40 h-40">
        <p class="text-2xl font-bold p-10">${product.price}€</p>
        <p class="text-lg p-10">${product.description}</p>
        <div class="flex justify-center items-center border border-gray-200 w-fit rounded-xl">
        <button class="bg-green-500 text-white p-2 m-5 rounded" id="like-${product.id}">I like it! (<span id="likes-${product.id}">${productLikes}</span>)</button>
        <button class="text-red-400 border-red-400 p-2 m-5 rounded" id="dislike-${product.id}">I don't like it (<span id="dislikes-${product.id}">${productDislikes}</span>)</button>

        </div>
        
    `;

  let giveLike = document.getElementById(`like-${product.id}`);

  giveLike.addEventListener("click", (event) => {
    //evento para dar me gusta
    event.preventDefault();
    like(product.id);
  });

  let giveDislike = document.getElementById(`dislike-${product.id}`);

  giveDislike.addEventListener("click", (event) => {
    //evento para dar no me gusta
    event.preventDefault();
    dislike(product.id);
  });
}

getProductInfo(productId) //llamo a la funcion que esta en global.js
  .then((product) => {
    displayProductInfo(product); //muestro la informacion del producto
  })
  .catch((error) => {
    console.error("Error fetching product information:", error);
  });

let addToCartForm = document.getElementById("add-to-cart");
let addToFavorites = document.getElementById("add-to-favorites");

addCartEventListeners(addToCartForm); //evento para añadir al carrito
addFavoriteEventListeners(addToFavorites); //evento para añadir a favoritos
