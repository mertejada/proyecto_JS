const productsURL = 'https://fakestoreapi.com/products';
const productsSortDescURL = 'https://fakestoreapi.com/products?sort=desc'; 
const productsSortAscURL = 'https://fakestoreapi.com/products?sort=asc';
const categoryURL = 'https://fakestoreapi.com/products/category/';

const productList = document.getElementById('product-list');
const productTable = document.getElementById('product-table');

let currentView = 'list';
let sortBy = 'asc';

let currentPage = 1;
const productsPerPage = 20; 

const categorySelect = document.getElementById('category');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

categorySelect.addEventListener('change', function() {
    sortBy = this.value;
    currentPage = 1;
    displayView(currentView);

});

let category;
let urlParams = new URLSearchParams(window.location.search);


function getProducts(page,sortBy) {


    if (urlParams.has('cat')) {
        category = urlParams.get('cat');

        document.getElementById('sortby-category').style.display = 'none';

        return fetch(`${categoryURL}${category}`)
        .then(response => response.json())
        .then(products => products);
    }
    


    let url = productsURL;

    if (sortBy === 'asc') {
        url = productsSortAscURL;
    } else if (sortBy === 'desc') {
        url = productsSortDescURL;
    }
    
    return fetch(`${url}&limit=${productsPerPage}&page=${page}`)
        .then(response => response.json())
        .then(products => products);
}

function createListView(products) {
    

    if (currentPage === 1) {
        productList.innerHTML = ''; // Limpiar lista de productos solo en la primera carga
    }

    products.forEach(product => {

        
        const productItem = document.createElement('li');
        productItem.classList.add('border', 'border-gray-200', 'p-4', 'flex', 'justify-between', 'items-center','bg-white');
        productItem.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}" class="w-20 h-20">
            <p>${product.price}€</p>
            <a href="#" id="see-${product.id}" class="bg-orange-500 text-white p-2 m-5 rounded cursor-pointer">See more</a>
            <div>
                <form id="add-to-cart-${product.id}" class="flex flex-col border rounded-md p-4">
                    <input type="number" name="units" id="units" min="1" value="1" class="bg-gray-100 mb-3 px-3 py-2 rounded w-24">
                    <input type="submit" value="Add to cart" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                </form> 
                <button id="add-to-favorites-${product.id}" class=" bg-gray-400 text-white p-2 rounded cursor-pointer mt-3 mx-4">Add to favorites</button>
            </div>


        `;//border', 'border-blue-600', 'text-blue-600', 'p-2', 'rounded-md', 'm-2
        let seeProduct = productItem.querySelector(`#see-${product.id}`);
        seeProduct.addEventListener('click', (event) => {
            event.preventDefault();
            redirectToProductPage(product.id);
        });
        productList.appendChild(productItem);

        
        let addToCartForm = productItem.querySelector(`#add-to-cart-${product.id}`);
        addCartEventListeners(addToCartForm, product.id);

        let addToFavorites = productItem.querySelector(`#add-to-favorites-${product.id}`);
        addFavoriteEventListeners(addToFavorites, product.id);
    
        productItem.classList.add('transition' ,'duration-300' ,'ease-in-out','transform', 'hover:scale-105', 'hover:bg-gray-100');
        
    });

    productList.style.display = 'block';
    productTable.style.display = 'none';
}

function createTableView(products) {
    let tbody = document.querySelector('#product-table tbody');

    if (currentPage === 1) {
        tbody.innerHTML = ''; 
    } 

    products.forEach(product => {

        let productLikes = 0;

        if(localStorage.getItem('likedItems')) {
            let likedItems = JSON.parse(localStorage.getItem('likedItems'));
            productLikes = likedItems[product.id] || 0;
        }

        let productRow = document.createElement('tr');

        productRow.classList.add('border', 'border-gray-200');
        productRow.innerHTML = `
            <td class="p-4">${product.title}</td>
            <td><img src="${product.image}" alt="${product.title}" class="w-20 h-20"></td>
            <td class="p-4 text-center">${product.price}€</td>
            <td><a href="#" id="see-${product.id}" class="cursor-pointer bg-orange-500 text-white p-2 m-5 rounded">See more</a></td>
            <td>
            <form id="add-to-cart-${product.id}" class="flex flex-col border rounded-md p-4">
                    <input type="number" name="units" id="units" min="1" value="1" class="bg-gray-100 mb-3 px-3 py-2 rounded w-24">
                    <input type="submit" value="Add to cart" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                </form> 
                <button id="add-to-favorites-${product.id}" class=" bg-gray-400 text-white p-2 rounded cursor-pointer mt-3 mx-4">Add to favorites</button>
            </td>
        `;

        let seeProduct = productRow.querySelector(`#see-${product.id}`);
        seeProduct.addEventListener('click', (event) => {
            event.preventDefault();
            redirectToProductPage(product.id);
        });

        let addToCartForm = productRow.querySelector(`#add-to-cart-${product.id}`);
        addCartEventListeners(addToCartForm, product.id);

        let addToFavorites = productRow.querySelector(`#add-to-favorites-${product.id}`);
        addFavoriteEventListeners(addToFavorites, product.id);
    
        productRow.classList.add('transition' ,'duration-300' ,'ease-in-out','transform', 'hover:scale-105', 'hover:bg-gray-100');
        
        tbody.appendChild(productRow);
    });

    document.getElementById('product-table').style.display = 'block';
    document.getElementById('product-list').style.display = 'none';
}




document.getElementById('choose-view').addEventListener('click', (event) => {
    if (event.target.id === 'list') {
        currentView = 'list';
        displayView(currentView);
    } else if (event.target.id === 'table') {
        currentView = 'table';
        displayView(currentView);
    }
});

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        currentPage++;
        displayView(currentView);
    }
});



function displayView(currentView) {
    getProducts(currentPage, sortBy)
    .then(products => {
        if (currentView === 'list') {
            createListView(products);
        } else if (currentView === 'table') {
            createTableView(products);
            document.getElementById('product-table').addEventListener('scroll', function() {
                if (this.offsetHeight + this.scrollTop >= this.scrollHeight) {
                    currentPage++;
                    displayView(currentView);
                }
            });
        }
    });
}

displayView(currentView);

function redirectToProductPage(productId) {
    window.location.href = `product.html?id=${productId}`;
}


