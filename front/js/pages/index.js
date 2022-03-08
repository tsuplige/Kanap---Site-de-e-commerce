import {getAllData} from "../dataManager.js";
showPage();


/**
 * [showPage affiche les différent produit transmi par l'API]
 *
 * @return  {promise} ajoute les produit au html 
 */
async function showPage(){
    //aller chercher nos données
    const data = await getAllData();

    //afficher les données
    let html = "";
    data.forEach(produit => {
        html+=`
          <a href="./product.html?id=${produit._id}">
            <article>
              <img src="${produit.imageUrl}" alt="${produit.altTxt}">
              <h3 class="productName">${produit.name}</h3>
              <p class="productDescription">${produit.description}</p>
            </article>
          </a>`
    });
    document.getElementById("items").innerHTML = html;
}