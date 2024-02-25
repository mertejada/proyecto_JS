const productsURL = 'https://fakestoreapi.com/products';
const productsSortDescURL = 'https://fakestoreapi.com/products?sort=desc'; 
const productsSortAscURL = 'https://fakestoreapi.com/products?sort=asc';

const productList = document.getElementById('product-list');
const productTable = document.getElementById('product-table');

let currentView = 'list';
let sortBy = 'asc';

let currentPage = 1;
const productsPerPage = 20; // Cantidad de productos por página

const categorySelect = document.getElementById('category');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

categorySelect.addEventListener('change', function() {
    sortBy = this.value;
    currentPage = 1;
    displayView(currentView);

});

function getProducts(page,sortBy) {
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
        productItem.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>${product.price}€</p>
        `;
        productItem.addEventListener('click', () => redirectToProductPage(product.id));
        productList.appendChild(productItem);
        
        //debe haber una ANIMACION sencilla en la propia tarjeta del producto al pasar el cursor encima
        productItem.addEventListener('mouseover', () => {
            productItem.style.backgroundColor = 'lightgray';
        });

        //que cuando se va el cursor vuelva a su estado original
        productItem.addEventListener('mouseout', () => {
            productItem.style.backgroundColor = 'white';
        });
    });

    productList.style.display = 'block';
    productTable.style.display = 'none';
}

function createTableView(products) {

    if (currentPage === 1) {
        productTable.innerHTML = ''; // Limpiar tabla de productos solo en la primera carga
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');
    const headers = ['Title', 'Image', 'Price'];

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    products.forEach(product => {
        const productRow = document.createElement('tr');
        productRow.value = product.id;
        productRow.innerHTML = `
            <td>${product.title}</td>
            <td><img src="${product.image}" alt="${product.title}"></td>
            <td>${product.price}€</td>
        `;
        productRow.addEventListener('click', () => redirectToProductPage(product.id));
        tbody.appendChild(productRow);

        //Debe producirse alguna animación sencilla en la propia tarjeta del producto al pasar el cursor encima 

        productRow.addEventListener('mouseover', () => {
            productRow.style.backgroundColor = 'lightgray';
        });

        productRow.addEventListener('mouseout', () => {
            productRow.style.backgroundColor = 'white';
        });
    });

    table.appendChild(tbody);
    productTable.innerHTML = '';
    productTable.appendChild(table);

    productList.style.display = 'none';
    productTable.style.display = 'block';
}

function displayView(currentView, products) {
    if (currentView === 'list') {
        createListView(products);
    } else if (currentView === 'table') {
        createTableView(products);
    }
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
    .then(products => 
        {
            if (currentView === 'list') {
                createListView(products);
            } else if (currentView === 'table') {
                createTableView(products);
            }


        });
}

displayView(currentView);

function redirectToProductPage(productId) {
    window.location.href = `product.html?id=${productId}`;
}
