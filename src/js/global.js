let element = document.getElementById('close-session');

element.addEventListener('click', () => {
    localStorage.removeItem('currentUsername');
    window.location.href = 'index.html';
});


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


function redirectToProductPage(productId) {
    window.location.href = `product.html?id=${productId}`;
}

function like(productId) {
    //el objeto likedItems ya esta creado, ahora hay que añdair un objeto con el id del producto y el numero de likes
    //si el producto ya esta en el objeto, se le suma un like

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