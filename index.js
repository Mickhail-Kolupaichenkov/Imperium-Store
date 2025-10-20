import { products } from "./data1.js";

const productsData = JSON.parse(products);

const cartOpenedBtn = document.getElementById("cart-button");
const cartBlock = document.getElementById("cart");
const cartCloseBtn = document.getElementById("cart-close");
const cardItemsBLock = document.getElementById("card-items");
const cartEmpty = document.getElementById("cart-empty");

let cartProducts = [];

function cartContentRender() {
    if (cartProducts.length === 0) {
        cartEmpty.style.display = "block";
    } else {
        cartEmpty.style.display = "none";
    }
}

cartContentRender()

cartOpenedBtn.addEventListener("click", () => {
    cartBlock.style.display = "block";
});

cartCloseBtn.addEventListener("click", () => {
    cartBlock.style.display = "none";
})

function cardItemsRender () {
    const cardItem = productsData.map((item) => {
    const {
        id,
        title,
        price,
        imgUrl,
        favoriteFlag,
        cartAdd
    } = item;
    return `
    <div class="card-item">
        <img src="${imgUrl}" alt="">
        <h4>${title}</h4>
        <div class="card-item__price-block">
            <span>Цена: ${price}руб.</span>
            <button>➕</button>
        </div>
        <button class="card-item__button-favorite">🖤</button>
    </div>
    `;
    }).join("");
    cardItemsBLock.innerHTML = cardItem;
}

cardItemsRender();