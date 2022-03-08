import { getProductData, updateCart } from "../dataManager.js";

const id = getPageId();
let name, price, altTxt, imageUrl;
showProduct();

/**
 * [fonction qui recupere l'ID du produit via l'URL de la page]
 *
 * @return  {string}  [id du produit]
 */
function getPageId() {
  var str = document.location.href;
  var url = new URL(str);
  var idPage = url.searchParams.get('id');
  console.log(idPage);

  return idPage;
}

/**
 * fonction qui affiche les information et image du produit
 *
 * @return  {promise} affiche les différente information du produit 
 */
async function showProduct() {
  //récupération des données
  const produit = await getProductData(id);
  name = produit.name;
  price = produit.price;
  imageUrl = produit.imageUrl;
  altTxt = produit.altTxt;
  //afficher les données
  document.getElementsByClassName('item__img')[0].innerHTML += `<img src="${produit.imageUrl}" alt="${produit.altTxt}">`;
  document.getElementById('title').innerHTML = produit.name;
  document.getElementById('price').innerHTML = produit.price;
  let html = "";
  for (const couleur of produit.colors) {
    html += `<option value="${couleur}">${couleur}</option>`;
  }
  document.getElementById('colors').innerHTML = html;
  document.getElementById('description').innerHTML = produit.description;
  document.title = produit.name;
}

//lance la fonction addToCart au clique du bouton

var btn = document.getElementById('addToCart');
btn.addEventListener('click', addToCart)

/**
 * [fonction qui Ajout item, nom, prix et quantité au localStorage]
 *
 * @return  {void}
 */
function addToCart() {

  // @ts-ignore
  const quantity = parseInt(document.getElementById('quantity').value);
  updateCart({
    id,
    price,
    name,
    imageUrl,
    altTxt
  }, quantity);
}