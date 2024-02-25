let cartTable = document.getElementById('cart-table');

let currentUser = localStorage.getItem('currentUsername');

let cart = JSON.parse(localStorage.getItem(`cart-${currentUser}`)) || [];

let total = 0;
let totalPrice = document.getElementById('total-price');

cart.forEach(product => {
    let row = document.createElement('tr');

    row.innerHTML = `
        <td>${product.title}</td>
        <td>${product.price}€</td>
        <td>${product.units}</td>
        <td>${product.price * product.units}€</td>
        <td><button class="remove-product" data-id="${product.id}">Remove</button></td>
        <td><form id="change-units"> 
            <input type="number" name="units" id="units" value="${product.units}" min="1">
            <input type="submit" value="Change">
        </form></td>
    `;
    cartTable.appendChild(row);

    let removeButton = row.querySelector('.remove-product');
    removeButton.addEventListener('click', (event) => {
        let productId = event.target.getAttribute('data-id'); 
        let productIndex = cart.findIndex(item => item.id === productId); //busca el indice del producto en el carrito
        cart.splice(productIndex, 1); 
        localStorage.setItem(`cart-${currentUser}`, JSON.stringify(cart)); 
        row.remove();
        total -= product.price * product.units;
        totalPrice.innerHTML = `${total}€`;
    });

    let changeUnitsForm = row.querySelector('#change-units');

    changeUnitsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let newUnits = parseInt(event.target.units.value);//coge el valor del input

        product.units = newUnits; //sustituye las unidades antiguas por las nuevas
        localStorage.setItem(`cart-${currentUser}`, JSON.stringify(cart)); //actualiza el carrito


        row.children[2].innerHTML = newUnits; //actualiza las unidades en la tabla
        row.children[3].innerHTML = `${product.price * newUnits}€`; //actualiza el precio total en la tabla

        //vuele a calcular el precio total
        total = 0; //resetea el total
        cart.forEach(product => {
            total += product.price * product.units;
        });
        
        totalPrice.innerHTML = `${total}€`;
    });

    total += product.price * product.units;

    totalPrice.innerHTML = `${total}€`;
});


let processButton = document.getElementById('process-button');

processButton.addEventListener('click', () => {
    if (total > 0) {
        alert('Your purchase has been processed successfully!');
        localStorage.removeItem(`cart-${currentUser}`);
        cartTable.innerHTML = '';
        total = 0;
        totalPrice.innerHTML = `${total}€`;

    } else {
        alert('You have no products on your cart.');
    }
});
