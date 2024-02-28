const contactForm = document.getElementById('contact-form');
const mapContainer = document.getElementById('map');

let mymap = L.map(mapContainer).setView([37.1922201, -3.6169587], 14); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

let marker = L.marker([37.1922201, -3.6169587]).addTo(mymap)
    .bindPopup("<b>We're here!</b><br/>IES Francisco Ayala. Granada, Spain").openPopup();


function validateInput(input) {
    let inputName = input.name;
    if (input.validity.typeMismatch) { // email
        input.setCustomValidity(`Introduce a valid ${inputName}`);
        input.reportValidity();
    } else if (input.validity.patternMismatch) { // name
        input.setCustomValidity(`Introduce a valid ${inputName} `);
        input.reportValidity();
    }else if (input.validity.valueMissing) { // empty
        input.setCustomValidity(`${inputName} is empty`);
        input.reportValidity();
    } else {
        input.setCustomValidity('');
    }
}

let name = document.querySelector('#contact-form [name="name"]');
let email = document.querySelector('#contact-form [name="email"]');
let message = document.querySelector('#contact-form [name="message"]');

name.addEventListener('input', () => validateInput(name));
email.addEventListener('input', () => validateInput(email));
message.addEventListener('input', () => validateInput(message));


contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (name.validity.valid && email.validity.valid && message.validity.valid) {
        contactForm.reset();
        alert('Congratulations! You successfully sent your message!');
    }
});