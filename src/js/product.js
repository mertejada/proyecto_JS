
let productId = new URLSearchParams(window.location.search).get('id');

function getProductInfo(productId) {
    return fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json());
}

function displayProductInfo(product) {
    let productInfo = document.getElementById('product-info');
    let productLikes = 0;
    productInfo.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'text-center', 'p-4');


    if(localStorage.getItem('likedItems')) {
        let likedItems = JSON.parse(localStorage.getItem('likedItems'));
        productLikes = likedItems[product.id] || 0;
    }

    productInfo.innerHTML = `
        <h1 class="text-3xl font-bold p-10">${product.title}</h1> 
        <img src="${product.image}" alt="${product.title} id="product-img" class="w-40 h-40">
        <p class="text-2xl font-bold p-10">${product.price}€</p>
        <p class="text-lg p-10">${product.description}</p>
        <div class="flex justify-center items-center border border-gray-200 w-fit rounded-xl">
        <p id="likes-${product.id}" class="text-lg p-10" >${productLikes} likes</p>
        <button class="bg-green-500 text-white p-2 m-5 rounded" id="like-${product.id}">Like</button>
        </div>
        
    `;


    let giveLike = document.getElementById(`like-${product.id}`);

    giveLike.addEventListener('click', (event) => {
        event.preventDefault();

        like(product.id);
    });

    


}



getProductInfo(productId)
    .then(product => {
        displayProductInfo(product);
    })
    .catch(error => {
        console.error('Error fetching product information:', error);
    });

    let addToCartForm = document.getElementById('add-to-cart');
    let addToFavorites = document.getElementById('add-to-favorites');

    addToCartForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        let currentUser = localStorage.getItem('currentUsername');
    
        if (currentUser) {   
            let units = parseInt(document.getElementById('units').value);
    
            if (units < 1) {
                alert('You need to add at least 1 unit of the product to the cart.');
                return;
            }
    
            getProductInfo(productId)
                .then(product => {
                    let userCart = JSON.parse(localStorage.getItem(`cart-${currentUser}`)) || [];

                    let existingProduct = userCart.find(item => item.id === product.id);

                    if (existingProduct) {
                        existingProduct.units += units;
                    }else{
                        userCart.push({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            units: units
                        });
                    }
                    localStorage.setItem(`cart-${currentUser}`, JSON.stringify(userCart));
                    alert('You added the product to the cart!');
                    
                })
                .catch(error => {
                    console.error('Error fetching product information:', error);
                });
        } else {
            alert('You must be logged in to add products to the cart.');
        }
    });

    addToFavorites.addEventListener('click', (event) => {
        event.preventDefault();

        let currentUser = localStorage.getItem('currentUsername');

        if (currentUser) {
            getProductInfo(productId)
                .then(product => {
                    let userFavorites = JSON.parse(localStorage.getItem(`favorites-${currentUser}`)) || [];

                    let existingProduct = userFavorites.find(item => item.id === product.id);

                    if (!existingProduct) {
                        userFavorites.push({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            img: product.image
                        });
                        localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(userFavorites));
                        alert('You added the product to your favorites!');
                    } else {
                        alert('This product is already in your favorites.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching product information:', error);
                });
        } else {
            alert('You must be logged in to add products to your favorites.');
        }
    });
    





