const source = "http://localhost:3000/api/products";

/**
 * la fonction getAllData recupere les donné de l'API
 * 
 *
 * @return  {Promise}  [retourne les donné de l'API]
 */
async function getAllData(){
    const answer = await fetch(source);
    const data = await answer.json();
    return data;
}

/**
 * [ recupere le pruduit correspondant à l'id passer en paramètre]
 *
 * @param   {string}  id  [prend en parametre l'id du produit]
 *
 * @return  {Promise}      [retourne les donnés du produit]
 */

async function getProductData(id){
    const answer = await fetch(source+"/"+id);
    const data = await answer.json();
    return data;

}

/**
 * [getCart recupère les donné du panier stocké dans le localStorage]
 *
 * @return  {Array}  [return description]
 */
function getCart(){
    let localStorageData = JSON.parse(localStorage.getItem("panier"));
    if ( localStorageData === null) localStorageData = {};
    return localStorageData;
}

/**
 * met à jour le panier
 *
 * @param   {Object}  product        les informations du produit
 * @param   {String}  product.id     l'id du produit
 * @param   {Number}  product.price  le prix du produit
 * @param   {String}  product.name   le nom du produit
 * @param   {Number}  product.altTxt  le texte alternatif
 * @param   {String}  product.imageUrl   l'adresse de l'image'
 * @param   {Number}  qty            la quantité à ajouter
 *
 * @return  {void}                   met à jour le localStorage
 */
function updateCart(product, qty){
    const {id, price, name, altTxt, imageUrl} = product;
    const localStorageData = getCart();
    if (localStorageData[id] === undefined) {
      localStorageData[id] = {
        price,
        name,
        imageUrl,
        altTxt,
        qty:0
      };
    }  
    localStorageData[id].qty += qty;
    updateLocalStorage(localStorageData);
}

/**
 * [removeFromCart supprime un produit selectionné avec l'id passer en parametre]
 *
 * @param   {String}  idProduct  [ID du produit]
 *
 * @return  {void}
 */
function removeFromCart(idProduct){
    const localStorageData = getCart();
    delete localStorageData[idProduct];
    updateLocalStorage(localStorageData);
}

/**
 * [updateLocalStorage mets à jour le panier contenu dans le localStorage avec de nouvelle données passée en parametre]
 *
 * @param   {Array}  newData  [newData description]
 *
 * @return  {void}
 */
function updateLocalStorage(newData){
    localStorage.setItem("panier", JSON.stringify(newData));
}


/**
 * change la quantité d'un produit
 *
 * @param   {String}  idProduct  [idProduct description]
 * @param   {String}  qty        [qty description]
 *
 * @return  {void}               met à jour la quantité dans le localStorage
 */
function updateQty(idProduct, qty){
    const localStorageData = getCart();
    localStorageData[idProduct].qty = parseInt(qty);
    updateLocalStorage(localStorageData);
}


/**
 * [sendOrder envoi les donné passé en parametre au serveur et revoie le numéro de commande]
 *
 * @param   {Array}  data  [object contact et tableau de produits]
 *
 * @return  {Promise.<Object>}  retourne un objet contenant 
 */
async function sendOrder(data){
    try{
        
    const requestDetails=  { 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(data)
    };

    const result = await fetch(source+"/order",requestDetails);
    const extract = await result.json();
    sessionStorage.setItem("orderId", extract.orderId);
    window.location.href="confirmation.html";

    }
    catch(err){
        console.error(err);
    }
    
}


export {
    getAllData,
    getProductData,
    updateCart,
    getCart,
    removeFromCart,
    updateQty,
    sendOrder
}