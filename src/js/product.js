let productId = new URLSearchParams(window.location.search).get('id');

function getProductInfo(productId) {
    return fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json());
}

function displayProductInfo(product) {
    const productInfo = document.getElementById('product-info');
    productInfo.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>${product.price}€</p>
        <p>${product.description}</p>
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
    
        // Obtener el nombre de usuario actual del localStorage
        let currentUser = localStorage.getItem('currentUsername');
    
        // Verificar si hay un usuario actualmente autenticado
        if (currentUser) {   
            let units = parseInt(document.getElementById('quantity').value);
    
            if (units < 1) {
                alert('You need to add at least 1 unit of the product to the cart.');
                return;
            }
    
            // Obtener el producto completo desde algún lugar, aquí asumimos que hay una función getProductInfo(productId)
            getProductInfo(productId)
                .then(product => {
                    let userCart = JSON.parse(localStorage.getItem(`cart-${currentUser}`)) || [];

                    // Verificar si el producto ya está en el carrito
                    let existingProduct = userCart.find(item => item.id === product.id);

                    if (existingProduct) {
                        // Si el producto ya está en el carrito, incrementar la cantidad
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
    


