import { getCart, removeFromCart, updateQty, sendOrder } from "../dataManager.js";

const contact   = {};
const regexs    = {
  "email" : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  "firstName" : /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]+$/u,
  "lastName" : /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]+$/u,
  "address" : /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-1234567890]+$/u,
  "city" : /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-1234567890]+$/u,
}

const sendBtn = document.getElementById("order");
sendBtn.onclick = send;
const msgContainers = [];
  // @ts-ignore
window.removeProduct = function (idProduit) {
  removeFromCart(idProduit);
  const target = document.querySelector(`[data-id="${idProduit}"]`);
  target.parentNode.removeChild(target);
}
  // @ts-ignore
window.changeQty = updateQty;

const inputs = document.querySelectorAll("input");
inputs.forEach(input=>{
  input.addEventListener('input', checkInput );
  const elm = input.parentNode.querySelector("p")
  if (elm !== null) msgContainers.push(elm)
})



showCart();
/**
 * [affiche les produit dans le panier via le localStorage]
 *
 * @return  {promise} 
 */
async function showCart() {
  const products = getCart();
  let html = "";
  for (const [key, value] of Object.entries(products)) {
    html += `<article class="cart__item" data-id="${key}">
      <div class="cart__item__img">
        <img src="${value.imageUrl}" alt="${value.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
          <h2>${value.name}</h2>
          <p>${value.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : ${value.qty}</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${value.qty}" onchange="changeQty('${key}',this.value)">
          </div>
          <div class="cart__item__content__settings__delete" onclick="removeProduct('${key}')">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;

  }
  document.getElementById('cart__items').innerHTML = html;
}

/**
 * [a chaque saisie de l'utilisateur checkIntput utilise updateUserInfoStatus avec le vérificateur regex adéquat]  
 */
function checkInput(evt) {
  const input = evt.target;
  let regex = regexs[input.name];
  updateUserInfoStatus(regex.test(input.value) ? "" : "nom invalide", input);
}

/**
 * [verifie la saisie avec le regex passé en paramètre]
 *
 * @param   {string}  updateInfo  [message d'erreur du champ de saisie]
 * @param   {object}  field       [saisie utilisateur]
 *
 * @return  {void}
 */

function updateUserInfoStatus(updateInfo, field) {
  contact[field.id] = field.value;
  const container = field.parentNode.querySelector("p");
  container.innerHTML = updateInfo;
  let errors = 0;
  msgContainers.forEach(msg=>{
    if (msg.innerText !=="") errors++
  })
  if (errors > 0) sendBtn.setAttribute("disabled", "disabled");
  else sendBtn.removeAttribute("disabled");

}

foundTotal()

const qtyinputs = document.getElementById("cart__items");
qtyinputs.addEventListener('input', foundTotal );

async function foundTotal() {
  const products = getCart();
  let total = 0;
  let qty = 0
  for (const [key, value] of Object.entries(products)) {
    total += value.price * value.qty;
    qty += value.qty;
  }
  console.log(total);
  document.getElementById('totalQuantity').innerHTML = qty.toString();
  document.getElementById('totalPrice').innerHTML = total.toString();
}


/**
 * [send envoi les donné a l'API]
 *
 * 
 */
function send(evt){
  evt.stopPropagation();
  evt.preventDefault();
  sendOrder({
      // @ts-ignore
     "products" : Object.keys(getCart()),
     contact
  });
}
