
//CERRAR SESION
//-------------
let element = document.getElementById('close-session');

element.addEventListener('click', () => {
    localStorage.removeItem('currentUsername');
    window.location.href = 'index.html';
});

//CONSEGUIR LA INFORMACION EN CONCRETO DE UN PRODUCTO
//---------------------------------------------------
function getProductInfo(productId) {
    return fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json());
}

//MOSTRAR ENLACES PARA CADA CATEGORIA
//-------------------------------------
let categoryLinks = document.getElementById('category-links');

let urlCategories = 'https://fakestoreapi.com/products/categories';

fetch(urlCategories)
    .then(response => response.json())
    .then(categories => {
        categories.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.href = `products.html?cat=${category}`;
            categoryLink.textContent = category;
            categoryLink.classList.add('border', 'border-blue-600', 'text-blue-600', 'p-2', 'rounded-md', 'm-2');
            categoryLinks.appendChild(categoryLink);
        });
    });

//DAR LIKE A LOS PRODUCTOS
//-------------------------
function like(productId) {

    let likedItems = JSON.parse(localStorage.getItem('likedItems'));

    if (likedItems[productId]) {
        likedItems[productId]++;
    } else {
        likedItems[productId] = 1;
    }

    localStorage.setItem('likedItems', JSON.stringify(likedItems));

    updateLikesCount(productId, likedItems[productId]);
}

function updateLikesCount(productId, likesCount) {
    let productLikes = document.getElementById(`likes-${productId}`);
    if (productLikes) {
        productLikes.innerHTML = likesCount +" likes";
    }
}

//FUNCION PARA AÑADIR PRODUCTOS AL CARRITO
//------------------------------------------
function addCartEventListeners(cartItem,productId) {
        cartItem.addEventListener('submit', (event) => {
            event.preventDefault();
        
            let currentUser = localStorage.getItem('currentUsername');
        
            if (currentUser) {   
                let units = parseInt(event.target.units.value);
        
                if (units < 1) { //lo hago aqui aunque ya lo hago en el html
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

    }


//FUNCION PARA AÑADIR PRODUCTOS A FAVORITOS
//------------------------------------------
function addFavoriteEventListeners(favoriteItem,productId) {
    favoriteItem.addEventListener('click', (event) => {
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
}



    