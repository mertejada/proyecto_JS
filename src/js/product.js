
let productId = new URLSearchParams(window.location.search).get('id');

function getProductInfo(productId) {
    return fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json());
}

function displayProductInfo(product) {
    let productInfo = document.getElementById('product-info');

    productInfo.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'text-center', 'p-4');
    productInfo.innerHTML = `
        <h1 class="text-3xl font-bold p-10">${product.title}</h1> 
        <img src="${product.image}" alt="${product.title} id="product-img" class="w-40 h-40">
        <p class="text-2xl font-bold p-10">${product.price}€</p>
        <p class="text-lg p-10">${product.description}</p>
        
    `;


}



getProductInfo(productId)
    .then(product => {
        displayProductInfo(product);
    })
    .catch(error => {
        console.error('Error fetching product information:', error);
    });

    let addToCartForm = document.getElementById('add-to-cart');

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
    



