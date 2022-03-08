addOrderId();

/**
 * addOrderId ajoute le numéro de commande au html
 *
 * @return  {void}
 */
function addOrderId() {
    let numCommande = sessionStorage.orderId ;
    sessionStorage.removeItem('orderId');
    document.getElementById("orderId").innerHTML = numCommande;
}
