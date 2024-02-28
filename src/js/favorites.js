let favTable = document.getElementById('favorites-table');

let currentUser = localStorage.getItem('currentUsername');

let favorites = JSON.parse(localStorage.getItem(`favorites-${currentUser}`)) || [];

favorites.forEach(product => {
    let row = document.createElement('tr');

    row.innerHTML = `
        <td><img src="${product.img}" alt="${product.title}" style="width: 50px;"></td>
        <td>${product.title}</td>
        <td>${product.price}€</td>
        <td><button class="remove-favorite bg-red-500 text-white p-1 rounded" data-id="${product.id}">Remove</button></td>
    `;
    favTable.appendChild(row);

    let removeButton = row.querySelector('.remove-favorite');
    removeButton.addEventListener('click', (event) => {
        let productId = event.target.getAttribute('data-id'); 
        let productIndex = favorites.findIndex(item => item.id === productId); 
        favorites.splice(productIndex, 1); 
        localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(favorites)); 
        row.remove();
    });
});