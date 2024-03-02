//URL FAKESTORE API
const usersURL = "https://fakestoreapi.com/users";
const productsURL = "https://fakestoreapi.com/products";
const productosRuta = "../html/products.html";
let currentUsername = localStorage.getItem("currentUsername");

let loginRegister = document.getElementById("login-register"); //esta es la seccion que contiene el login y el registro

loginRegister.addEventListener("click", (event) => {
  event.preventDefault();
  switch (event.target.id) {
    case "login-button": //si se pulsa el boton de ir al login
      document.getElementById("login").style.display = "block";
      document.getElementById("register").style.display = "none";
      break;
    case "register-button": //si se pulsa el boton de ir al registro
      document.getElementById("login").style.display = "none";
      document.getElementById("register").style.display = "block";
      break;
    case "register-submit": //si se envia el formulario de registro
      let username = document.querySelector(
        "#register [name='username']"
      ).value; //recojo el username

      if (localStorage.getItem(username)) {
        //compruebo si ya existia
        alert(
          "Sorry! This username is already in use. Try a different username"
        );
      } else {
        //si no, guardo el usuario en el localStorage con todos los datos
        let email = document.querySelector("#register [name='email']").value;
        let name = document.querySelector("#register [name='name']").value;
        let lastname = document.querySelector(
          "#register [name='lastname']"
        ).value;
        let dni = document.querySelector("#register [name='dni']").value;
        let age = document.querySelector("#register [name='age']").value;
        let password = document.querySelector(
          "#register [name='password']"
        ).value;
        let user = {
          email: email,
          name: name,
          lastname: lastname,
          dni: dni,
          age: age,
          password: password,
        };
        //he añadido un username para poder controlar que no se repitan los usuarios
        //(habia pensado en usar el dni o email, que es unico, pero para el login es mas comodo usar el username)
        localStorage.setItem(username, JSON.stringify(user));
        document.getElementById("register-form").reset();
        document.getElementById("register").style.display = "none";
        document.getElementById("login").style.display = "block";

        alert("You have signed up successfully!");

        location.reload(); //recargo la pagina para que se muestre el login de nuevo
      }
      break;
    case "login-submit": //si se envia el formulario de login
      let usernameLogin = document.querySelector(
        "#login [name='username']"
      ).value;
      let passwordLogin = document.querySelector(
        "#login [name='password']"
      ).value;
      login(usernameLogin, passwordLogin); //compruebo el login con los datos introducidos
      break;
  }
});

//FUNCION PARA VALIDAR LOS CAMPOS DEL REGISTRO
//------------------------------------------------
function validateNextField(inputName, nextInputName) {
  let input = document.querySelector(`#register [name='${inputName}']`);
  let nextInput = document.querySelector(`#register [name='${nextInputName}']`);

  if (input.validity.typeMismatch) {
    //si el tipo de dato no es el correcto
    input.setCustomValidity(`${inputName} not valid`);
    input.reportValidity();

    disableNextInput(nextInput); //desactivo el siguiente campo de nuevo
  } else if (input.validity.patternMismatch) {
    //si no cumple el patron
    input.setCustomValidity(`${inputName} not valid`);
    input.reportValidity();

    disableNextInput(nextInput);
  } else if (input.validity.rangeUnderflow) {
    //si el valor es menor que el minimo (edad)
    input.setCustomValidity(`${inputName} not valid`);
    input.reportValidity();

    disableNextInput(nextInput);
  } else if (input.validity.valueMissing) {
    //si el campo esta vacio
    input.setCustomValidity(`${inputName} is required`);
    input.reportValidity();

    disableNextInput(nextInput);
  } else {
    input.setCustomValidity("");
    nextInput.removeAttribute("disabled");
  }
}

//FUNCION PARA DESACTIVAR EL SIGUIENTE CAMPO
//-------------------------------------------
function disableNextInput(nextInput) {
  if (!nextInput.hasAttribute("disabled")) {
    //si no esta desactivado
    nextInput.setAttribute("disabled", "disabled");
  }
}

//EVENTOS PARA VALIDAR LOS CAMPOS DEL REGISTRO
//--------------------------------------------
document
  .querySelector("#register [name='username']")
  .addEventListener("input", () => validateNextField("username", "email"));
document
  .querySelector("#register [name='email']")
  .addEventListener("input", () => validateNextField("email", "name"));
document
  .querySelector("#register [name='name']")
  .addEventListener("input", () => validateNextField("name", "lastname"));
document
  .querySelector("#register [name='lastname']")
  .addEventListener("input", () => validateNextField("lastname", "dni"));
document
  .querySelector("#register [name='dni']")
  .addEventListener("input", () => validateNextField("dni", "age"));
document
  .querySelector("#register [name='age']")
  .addEventListener("input", () => validateNextField("age", "password"));
document
  .querySelector("#register [name='password']")
  .addEventListener("input", () => validateNextField("password", "submit"));

//FUNCION PARA EL LOGIN
//---------------------
function login(username, password) {
  let user = JSON.parse(localStorage.getItem(username)); //recojo los datos del usuario del localStorage
  if (user) {
    //si existe el usuario
    if (user.password === password) {
      //compruebo si la contraseña es correcta
      alert("Login successful");
      localStorage.setItem("currentUsername", username); //guardo el usuario actual en el localStorage
      window.location.assign(productosRuta); //redirijo a la pagina de productos
    } else {
      alert("The password is incorrect. Please try again.");
    }
  } else {
    //si no existe el usuario en el localStorage, lo busco en la api
    fetch(usersURL)
      .then((response) => response.json())
      .then((data) => {
        let user = data.find((user) => user.username === username); //busco el usuario en la api
        if (user) {
          //mismo proceso que antes
          if (user.password === password) {
            //yo he decidido guardar los usuarios de la api en el localStorage, pero no es necesario
            localStorage.setItem(username, JSON.stringify(user));
            localStorage.setItem("currentUsername", username);

            alert("Login successful");
            window.location.replace(productosRuta);
          } else {
            alert("The password is incorrect. Please try again.");
          }
        } else {
          //si no existe el usuario en la api ni en el localStorage
          alert(
            "We couldn't find a user with that username. Please try again or register a new account."
          );
        }
      });
  }
}
