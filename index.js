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

function cardItemsRender(productsData) {
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

// function toggleFavorite(productId) {
//     const product = productsData.find(item => item.id === productId);
    
//     const existingIndex = favoriteProducts.findIndex(fav => fav.id === productId);
    
//     if (existingIndex === -1) {
//         favoriteProducts.push(product);
        
//     } else {
//         favoriteProducts.splice(existingIndex, 1);
        
//     }
    
//     cardItemsRender(productsData);
//     updateFavoriteCounter();
// }

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
    const cartTotalOpen = document.querySelector("#cart-total-price");
    if (cartTotal) {
        const totalPrice = cartProducts.reduce((sum, product) => sum + parseInt(product.price), 0);
        cartTotal.textContent = `🛡️ ${totalPrice} руб.`;
        cartTotalOpen.textContent = `${totalPrice} руб.`
    }
}

cardItemsRender(productsData);

//=============================================================================================================

//Логика слайдера
function initSlider() {
    const images = document.querySelectorAll('.slaider__image');
    const dots = document.querySelectorAll('.slaider__dot');
    const prevBtn = document.querySelector('.slaider__content__button--prev');
    const nextBtn = document.querySelector('.slaider__content__button--next');
    
    if (images.length === 0) {
        return;
    }
    
    let currentIndex = 0;
    let slideInterval = null; // Инициализируем как null

    // Функция показа слайда
    function showSlide(index) {
        // Скрываем все изображения и точки
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Показываем текущее изображение и точку
        images[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
    }

    // Следующий слайд
    function nextSlide() {
        let nextIndex = (currentIndex + 1) % images.length;
        showSlide(nextIndex);
    }

    // Предыдущий слайд
    function prevSlide() {
        let prevIndex = (currentIndex - 1 + images.length) % images.length;
        showSlide(prevIndex);
    }

    // Автопереключение
    function startAutoSlide() {
        // Сначала останавливаем предыдущий интервал
        stopAutoSlide();
        // Запускаем новый
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Остановка автослайдера
    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // Обработчики для кнопок
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    // Обработчики для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Пауза при наведении на слайдер
    const sliderContent = document.querySelector('.slaider__content');
    sliderContent.addEventListener('mouseenter', stopAutoSlide);
    sliderContent.addEventListener('mouseleave', startAutoSlide);

    // Запускаем автослайдер
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', function() {
    initSlider();
});

//=============================================================================================================

//Рендеринг закладок
const favoriteBtn = document.getElementById("favorite-button");
const mainTitleText = document.getElementById("main-title-text");
const searchContainer = document.querySelector(".search-container")
let currentView = 'all';

favoriteBtn.addEventListener("click", () => {
    currentView = 'favorites';
    cardItemsRender(favoriteProducts);
    mainTitleText.textContent = "Ваши закладки";
    searchContainer.style.display = "none";
});

const logoBtn = document.getElementById("logo-block");
logoBtn.addEventListener("click", () => {
    currentView = 'all';
    cardItemsRender(productsData);
    mainTitleText.textContent = "Все товары";
    searchContainer.style.display = "flex";
});

function toggleFavorite(productId) {
    const product = productsData.find(item => item.id === productId);
    
    const existingIndex = favoriteProducts.findIndex(fav => fav.id === productId);
    
    if (existingIndex === -1) {
        favoriteProducts.push(product);
    } else {
        favoriteProducts.splice(existingIndex, 1);
    }
    
    updateFavoriteCounter();
    refreshCurrentView();
}

function refreshCurrentView() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (currentView === 'favorites') {
        cardItemsRender(favoriteProducts);
        mainTitleText.textContent = "Ваши закладки";
        searchContainer.style.display = "none";
    } else {
        searchContainer.style.display = "flex";
        
        if (searchTerm !== '') {
            const foundProducts = productsData.filter(product => 
                product.title.toLowerCase().includes(searchTerm)
            );
            cardItemsRender(foundProducts);
            
            if (foundProducts.length === 0) {
                mainTitleText.textContent = `Ничего не найдено: "${searchTerm}"`;
            } else {
                mainTitleText.textContent = `Найдено товаров: ${foundProducts.length}`;
            }
        } else {
            cardItemsRender(productsData);
            mainTitleText.textContent = "Все товары";
        }
    }
}

//=============================================================================================================

//Логика и рендер поиска
const searchInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');

function initSearch() {
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            cardItemsRender(productsData);
            mainTitleText.textContent = "Все товары";
            return;
        }

        const foundProducts = productsData.filter(product => 
            product.title.toLowerCase().includes(searchTerm)
        );

        cardItemsRender(foundProducts);
        if (foundProducts.length === 0) {
            mainTitleText.textContent = `Ничего не найдено: "${searchTerm}"`;
        } else {
            mainTitleText.textContent = `Найдено товаров: ${foundProducts.length}`;
        }
    }

    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

document.addEventListener('DOMContentLoaded', initSearch);

//=============================================================================================================

//Имитация оформления заказа
//=============================================================================================================

// Логика оформления заказа
const buyButton = document.getElementById('buy-button');

if (buyButton) {
    buyButton.addEventListener('click', () => {
        if (cartProducts.length === 0) {
            alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
            return;
        }

        const orderData = {
            orderId: generateOrderId(),
            timestamp: new Date().toISOString(),
            items: cartProducts,
            totalAmount: cartProducts.reduce((sum, product) => sum + parseInt(product.price), 0),
            status: 'pending'
        };

        //имитация
        console.log('ДАННЫЕ ЗАКАЗА ОТПРАВЛЕНЫ НА БЭКЕНД:');
        console.log('========================================');
        console.log('Order ID:', orderData.orderId);
        console.log('Время заказа:', new Date(orderData.timestamp).toLocaleString('ru-RU'));
        console.log('Товары в заказе:');
        orderData.items.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.title} - ${item.price} руб.`);
        });
        console.log('Общая сумма:', orderData.totalAmount + ' руб.');
        console.log('Статус:', orderData.status);
        console.log('========================================');
        
        alert(`Заказ #${orderData.orderId} успешно оформлен!\n
                Сумма: ${orderData.totalAmount} руб.\n
                Товаров: ${cartProducts.length} шт.`);

        cartProducts = [];
        updateCartCounter();
        cartStateRender();
        cartBlock.style.display = "none";
    });
}
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}