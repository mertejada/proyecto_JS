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

categorySelect.addEventListener('change', function() { //evento para cambiar la manera de ordenar los productos
    sortBy = this.value; //valor del select
    currentPage = 1; //empiezo desde la primera pagina
    displayView(currentView);

});

let category;
let urlParams = new URLSearchParams(window.location.search);

//FUNCION PARA MOSTRAR LOS PRODUCTOS
//----------------------------------
function getProducts(page,sortBy) {
    if (urlParams.has('cat')) { //si la url tiene el parametro cat
        category = urlParams.get('cat');

        document.getElementById('sortby-category').style.display = 'none';

        return fetch(`${categoryURL}${category}`) //peticion con la categoria
        .then(response => response.json()) 
        .then(products => products);
    }

    let url = productsURL;

    //por si cambia el valor del select
    if (sortBy === 'asc') {
        url = productsSortAscURL;
    } else if (sortBy === 'desc') {
        url = productsSortDescURL;
    }
    
    return fetch(`${url}&limit=${productsPerPage}&page=${page}`) //lo que devuelve la peticion
        .then(response => response.json())
        .then(products => products);
}


//FUNCION PARA MOSTRAR LOS PRODUCTOS EN LISTA
//------------------------------------------- 
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


        `;

        // Evento para ver más detalles del producto
        let seeProduct = productItem.querySelector(`#see-${product.id}`);
        seeProduct.addEventListener('click', (event) => {
            event.preventDefault();
            redirectToProductPage(product.id); //redirige a la pagina del producto
        });
        productList.appendChild(productItem);

        //evento para añadir al carrito
        let addToCartForm = productItem.querySelector(`#add-to-cart-${product.id}`);
        addCartEventListeners(addToCartForm, product.id);

        //evento para añadir a favoritos
        let addToFavorites = productItem.querySelector(`#add-to-favorites-${product.id}`);
        addFavoriteEventListeners(addToFavorites, product.id);
    
        productItem.classList.add('transition' ,'duration-300' ,'ease-in-out','transform', 'hover:scale-105', 'hover:bg-gray-100');
        
    });

    //mostrar la lista de productos y ocultar la tabla
    productList.style.display = 'block';
    productTable.style.display = 'none';
}


//FUNCION PARA MOSTRAR LOS PRODUCTOS EN TABLA
//-------------------------------------------
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

    //mostrar la tabla de productos y ocultar la lista
    document.getElementById('product-table').style.display = 'block';
    document.getElementById('product-list').style.display = 'none';
}


//Evento para controlar la vista
document.getElementById('choose-view').addEventListener('click', (event) => {
    if (event.target.id === 'list') {
        currentView = 'list';
        displayView(currentView);
    } else if (event.target.id === 'table') {
        currentView = 'table';
        displayView(currentView);
    }
});

//Evento para controlar el scroll infinito
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        currentPage++;
        displayView(currentView);
    }
});


//FUNCION PARA GENERAR LA VISTA
//-----------------------------
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

//FUNCION PARA REDIRIGIR A LA PAGINA DEL PRODUCTO
//----------------------------------------------
function redirectToProductPage(productId) {
    window.location.href = `product.html?id=${productId}`;
}


displayView(currentView); //por defecto muestra la vista en lista



