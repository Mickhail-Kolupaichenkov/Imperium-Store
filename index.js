//Подключаем данные
import { products } from "./data1.js";
    const productsData = JSON.parse(products);
//=============================================================================================================

//Логика корзины
let cartProducts = []; //Коллекция для товаров в корзине
const cartOpenedBtn = document.getElementById("cart-button");
const cartBlock = document.getElementById("cart");
const cartCloseBtn = document.getElementById("cart-close");
const cartEmpty = document.getElementById("cart-empty");

function cartStateRender() {
    if (cartProducts.length === 0) {
        cartEmpty.style.display = "block";
    } else {
        cartEmpty.style.display = "none";
        cartContentRender()
    }
}

function cartContentRender () {
    const cartItemsContainer = document.querySelector('.cart-items');
    
    const cartItemsHTML = cartProducts.map(item => {
        const {
            id,
            title,
            price,
            imgUrl
        } = item;
        
        return `
        <div class="cart-item" data-id="${id}">
            <img src="${imgUrl}" alt="${title}">
            <div class="cart-item__price-block">
                <div><h5>${title}</h5></div>
                <div class="cart-item__price-block--bottom">
                    <span>${price} руб.</span>
                    <button class="remove-from-cart-btn" data-id="${id}">❌</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    cartItemsContainer.innerHTML = cartItemsHTML;
    
    removeFromCartItem();
}

function removeFromCartItem() {
    const removeBtns = document.querySelectorAll('.remove-from-cart-btn');
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const productId = parseInt(event.target.dataset.id);

            cartProducts = cartProducts.filter(item => item.id !== productId);

            cartContentRender();
            updateCartCounter();
            cartStateRender();
            updateCartButton(productId);
        });
    });
}

cartStateRender();

cartOpenedBtn.addEventListener("click", () => {
    cartBlock.style.display = "block";
});

cartCloseBtn.addEventListener("click", () => {
    cartBlock.style.display = "none";
});

//=============================================================================================================

//Логика каталога товаров
const cardItemsBLock = document.getElementById("card-items");
let favoriteProducts = [];

function cardItemsRender() {
    const cardItem = productsData.map((item) => {
        const {
            id,
            title,
            price,
            imgUrl
        } = item;

        const isFavorite = favoriteProducts.some(fav => fav.id === id);
        const heartIcon = isFavorite ? '❤️' : '🖤';

        const isInCart = cartProducts.some(cartItem => cartItem.id === id); 
        const cartIcon = isInCart ? '✔️' : '➕'; 

        return `
        <div class="card-item">
            <img src="${imgUrl}" alt="${title}">
            <h4>${title}</h4>
            <div class="card-item__price-block">
                <span>Цена: ${price} руб.</span>
                <button data-id="${id}" class="add-to-cart-btn">${cartIcon}</button>
            </div>
            <button data-id="${id}" class="card-item__button-favorite">${heartIcon}</button>
        </div>
        `;
    }).join("");
    
    cardItemsBLock.innerHTML = cardItem;

    addFavoriteItem();
    addCartEventListeners();
}

function addFavoriteItem() {
    const favoriteBtns = document.querySelectorAll(".card-item__button-favorite");
    
    favoriteBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const productId = parseInt(event.target.dataset.id);
            toggleFavorite(productId);
        });
    });
}

function addCartEventListeners() {
    const cartBtns = document.querySelectorAll(".add-to-cart-btn");
    
    cartBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const productId = parseInt(event.target.dataset.id);
            addToCart(productId);
            cartStateRender()
        });
    });
}

function toggleFavorite(productId) {
    const product = productsData.find(item => item.id === productId);
    
    const existingIndex = favoriteProducts.findIndex(fav => fav.id === productId);
    
    if (existingIndex === -1) {
        favoriteProducts.push(product);
        
    } else {
        favoriteProducts.splice(existingIndex, 1);
        
    }
    
    cardItemsRender();
    updateFavoriteCounter();
}

function addToCart(productId) {
    const product = productsData.find(item => item.id === productId);
    
    const existingIndex = cartProducts.findIndex(item => item.id === productId);
    
    if (existingIndex === -1) {
        cartProducts.push(product);
        cartContentRender()
        cartStateRender()
    } else {
        cartProducts.splice(existingIndex, 1);
    }
    
    cartContentRender();
    updateCartCounter();
    updateCartButton(productId);
    cartStateRender()
}

function updateCartButton(productId) {
    const cartButton = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
    if (cartButton) {
        const isInCart = cartProducts.some(item => item.id === productId);
        cartButton.textContent = isInCart ? '✔️' : '➕';
    }
}

function updateFavoriteCounter() {
    const favoriteCounter = document.querySelector("#favorite-button span");
    if (favoriteCounter) {
        favoriteCounter.textContent = `Закладки (${favoriteProducts.length})`;
    }
}

function updateCartCounter() {
    const cartTotal = document.querySelector("#cart-button a");
    if (cartTotal) {
        const totalPrice = cartProducts.reduce((sum, product) => sum + parseInt(product.price), 0);
        cartTotal.textContent = `🛡️ ${totalPrice} руб.`;
    }
}

cardItemsRender();

//=============================================================================================================

