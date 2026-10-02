// -------------------------------------------------------------
// 1. PRODUCT DATA SOURCE
// -------------------------------------------------------------
const products = window.storeProducts;

let cart = [];
try {
    const savedCart = JSON.parse(localStorage.getItem('neoKineticCart') || '[]');
    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(entry => products.some(product => product.id === entry.productId) && Number.isInteger(entry.quantity) && entry.quantity > 0);
    }
} catch {
    cart = [];
}

// -------------------------------------------------------------
// 2. VIDEO SCROLL SCRUBBING ENGINE
// -------------------------------------------------------------
const video = document.getElementById('bg-video');
const telemetryScroll = document.getElementById('telemetryScroll');
const telemetryTime = document.getElementById('telemetryTime');

let targetTime = 0;
let currentTime = 0;
let isVideoReady = false;
let lastRenderTime = 0;
let lastSeekTime = 0;

// Ensure video metadata loaded
video.addEventListener('loadedmetadata', () => {
    isVideoReady = true;
    currentTime = video.currentTime;
    handleScroll();
});

// Calculate scroll progress and update video target time
function handleScroll() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const scrollFraction = Math.max(0, Math.min(1, window.scrollY / scrollableHeight));
    
    if (isVideoReady && video.duration) {
        targetTime = scrollFraction * video.duration;
    }

    // Update Telemetry Displays
    telemetryScroll.textContent = `${Math.round(scrollFraction * 100)}%`;
}

// Smooth Interpolation RAF Loop
function renderLoop() {
    if (isVideoReady && video.duration) {
        const elapsed = lastRenderTime ? Math.min(performance.now() - lastRenderTime, 64) : 16.7;
        const now = performance.now();
        lastRenderTime = now;
        currentTime += (targetTime - currentTime) * (1 - Math.exp(-elapsed / 120));

        if (!video.seeking && now - lastSeekTime >= 40 && Math.abs(currentTime - video.currentTime) > 0.025) {
            video.currentTime = currentTime;
            lastSeekTime = now;
        }
        telemetryTime.textContent = `${video.currentTime.toFixed(2)}s`;
    }
    requestAnimationFrame(renderLoop);
}

window.addEventListener('scroll', handleScroll, { passive: true });
requestAnimationFrame(renderLoop);

// -------------------------------------------------------------
// 3. E-COMMERCE RENDER & INTERACTION
// -------------------------------------------------------------
const productGrid = document.getElementById('productGrid');
const productSearch = document.getElementById('productSearch');
const productSort = document.getElementById('productSort');
let activeCategory = 'all';

function renderProducts() {
    productGrid.innerHTML = '';
    const query = productSearch.value.trim().toLowerCase();
    let filtered = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesQuery = `${product.name} ${product.category} ${product.specs}`.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    if (productSort.value === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (productSort.value === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (productSort.value === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    if (filtered.length === 0) {
        productGrid.innerHTML = '<p class="catalog-empty">No gear matches that search. Try another term or category.</p>';
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'glass-card product-card';
        card.innerHTML = `
            <span class="product-badge">${p.badge}</span>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">$${p.price.toFixed(2)}</div>
                <p class="product-specs-mini">${p.specs}</p>
            </div>
            <div class="card-actions">
                <button class="btn-cyber product-add-button" data-action="add-to-cart" data-product-id="${p.id}">ADD TO CART</button>
                <button class="btn-cyber product-quick-view" data-action="quick-view" data-product-id="${p.id}" aria-label="View details for ${p.name}">👁</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

productGrid.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    if (button.dataset.action === 'add-to-cart') addToCart(button.dataset.productId);
    if (button.dataset.action === 'quick-view') quickView(button.dataset.productId);
});

// Category Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        activeCategory = e.currentTarget.dataset.filter;
        setActiveFilter(activeCategory);
        renderProducts();
    });
});

function setActiveFilter(category) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        const isActive = button.dataset.filter === category;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

productSearch.addEventListener('input', renderProducts);
productSort.addEventListener('change', renderProducts);

document.querySelectorAll('[data-footer-filter]').forEach(link => {
    link.addEventListener('click', () => {
        activeCategory = link.dataset.footerFilter;
        setActiveFilter(activeCategory);
        renderProducts();
    });
});

// CART LOGIC
const cartDrawer = document.getElementById('cartDrawer');
const cartBadge = document.getElementById('cartBadge');
const cartCountHeader = document.getElementById('cartCountHeader');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalValue = document.getElementById('cartTotalValue');
const cartSubtotalValue = document.getElementById('cartSubtotalValue');
const cartShippingValue = document.getElementById('cartShippingValue');

function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    if (item) {
        const existingEntry = cart.find(entry => entry.productId === productId);
        if (existingEntry) existingEntry.quantity += 1;
        else cart.push({ productId, quantity: 1 });
        updateCartUI();
        openCart();
    }
}

function changeQuantity(productId, amount) {
    const entry = cart.find(item => item.productId === productId);
    if (!entry) return;
    entry.quantity += amount;
    if (entry.quantity <= 0) removeFromCart(productId);
    else updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(entry => entry.productId !== productId);
    updateCartUI();
}

function saveCart() {
    try {
        localStorage.setItem('neoKineticCart', JSON.stringify(cart));
    } catch {
        // Keep the current cart usable when browser storage is unavailable.
    }
}

function updateCartUI() {
    const itemCount = cart.reduce((count, entry) => count + entry.quantity, 0);
    const subtotal = cart.reduce((sum, entry) => {
        const product = products.find(item => item.id === entry.productId);
        return sum + (product ? product.price * entry.quantity : 0);
    }, 0);
    const shipping = subtotal === 0 ? 0 : 12;

    cartBadge.textContent = itemCount;
    cartCountHeader.textContent = itemCount;
    cartSubtotalValue.textContent = `$${subtotal.toFixed(2)}`;
    cartShippingValue.textContent = `$${shipping.toFixed(2)}`;
    cartTotalValue.textContent = `$${(subtotal + shipping).toFixed(2)}`;
    saveCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Cart buffer empty.</p>';
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach(entry => {
        const item = products.find(product => product.id === entry.productId);
        if (!item) return;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${(item.price * entry.quantity).toFixed(2)}</div>
            </div>
            <div class="cart-quantity-controls">
                <button data-action="change-quantity" data-product-id="${item.id}" data-change="-1" aria-label="Decrease ${item.name} quantity">-</button>
                <span>${entry.quantity}</span>
                <button data-action="change-quantity" data-product-id="${item.id}" data-change="1" aria-label="Increase ${item.name} quantity">+</button>
            </div>
            <button class="cart-remove" data-action="remove-from-cart" data-product-id="${item.id}" aria-label="Remove ${item.name}">&times;</button>
        `;
        cartItemsContainer.appendChild(el);
    });
}

cartItemsContainer.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    if (button.dataset.action === 'change-quantity') {
        changeQuantity(button.dataset.productId, Number(button.dataset.change));
    }
    if (button.dataset.action === 'remove-from-cart') removeFromCart(button.dataset.productId);
});

function openCart() { cartDrawer.classList.add('open'); }
function closeCart() { cartDrawer.classList.remove('open'); }

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const siteNavigation = document.getElementById('siteNavigation');

function closeMobileMenu() {
    siteNavigation.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
}

mobileMenuBtn.addEventListener('click', () => {
    const isOpen = siteNavigation.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

siteNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

document.getElementById('openCartBtn').addEventListener('click', openCart);
document.getElementById('closeCartBtn').addEventListener('click', closeCart);

// MODALS (QUICK VIEW / CHECKOUT)
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');

function openModal(contentHtml) {
    modalBody.innerHTML = contentHtml;
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

document.getElementById('closeModalBtn').addEventListener('click', closeModal);
modalBody.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    if (button.dataset.action === 'add-to-cart') {
        addToCart(button.dataset.productId);
        if (button.dataset.closeAfter === 'true') closeModal();
    }
    if (button.dataset.action === 'close-modal') closeModal();
});
modalBody.addEventListener('submit', event => {
    if (event.target.matches('.checkout-form')) completeDemoOrder(event);
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeCart();
        closeModal();
        closeMobileMenu();
    }
});
modalOverlay.addEventListener('click', event => {
    if (event.target === modalOverlay) closeModal();
});

function quickView(productId) {
    const item = products.find(p => p.id === productId);
    if (!item) return;

    openModal(`
        <div class="specification-kicker">SPECIFICATION MATRIX</div>
        <h2 class="specification-title">${item.name}</h2>
        <div class="specification-price">$${item.price.toFixed(2)}</div>

        <div class="specification-panel">
            <div class="specification-panel-title">FABRIC & TELEMETRY:</div>
            <p class="specification-copy">${item.specs}</p>
        </div>

        <button class="btn-cyber modal-primary-action" data-action="add-to-cart" data-product-id="${item.id}" data-close-after="true">ACQUIRE SPECIMEN</button>
    `);
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        openModal('<div class="empty-cart-modal"><h2>YOUR CART IS EMPTY</h2><p>Add an item from the collection before checkout.</p></div>');
        return;
    }

    closeCart();
    openModal(`
        <div class="checkout-kicker">SECURE CHECKOUT</div>
        <h2 class="checkout-heading">DELIVERY DETAILS</h2>
        <p class="checkout-demo-note">Front-end demo only. No payment will be collected and no order will be sent.</p>
        <form class="checkout-form">
            <label>Full name<input name="customerName" autocomplete="name" required></label>
            <label>Email address<input name="customerEmail" type="email" autocomplete="email" required></label>
            <label>Street address<input name="address" autocomplete="street-address" required></label>
            <div class="checkout-grid">
                <label>City<input name="city" autocomplete="address-level2" required></label>
                <label>Postal code<input name="postalCode" autocomplete="postal-code" required></label>
            </div>
            <button class="btn-cyber" type="submit">REVIEW DEMO ORDER</button>
        </form>
    `);
});

function completeDemoOrder(event) {
    event.preventDefault();
    const orderReference = `NK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    cart = [];
    updateCartUI();
    openModal(`
        <div class="demo-order-confirmation">
            <div class="demo-order-icon">&#10003;</div>
            <h2 class="demo-order-title">DEMO ORDER REVIEWED</h2>
            <p class="demo-order-reference">Reference: ${orderReference}</p>
            <p class="checkout-demo-note">This storefront is a front-end demo. No payment was taken and no order was transmitted.</p>
            <button class="btn-cyber demo-order-button" data-action="close-modal">BACK TO STORE</button>
        </div>
    `);
}

document.getElementById('newsletterForm').addEventListener('submit', event => {
    event.preventDefault();
    document.getElementById('newsletterStatus').textContent = 'Thanks. Signup is previewed locally and was not submitted.';
    event.currentTarget.reset();
});

const storeInfo = {
    contact: ['CONTACT', 'Support contact details can be connected when the store backend is configured.'],
    shipping: ['SHIPPING & RETURNS', 'Shipping and return options are informational placeholders in this front-end demo.'],
    size: ['SIZE GUIDE', 'Product-specific sizing details can be added here before launch.'],
    faq: ['FREQUENT QUESTIONS', 'Order tracking, payment, and returns require a connected store service.'],
    privacy: ['PRIVACY', 'This demo stores cart contents in this browser only. Newsletter signups are not transmitted.'],
    terms: ['TERMS', 'Purchases are not processed by this front-end demo. Connect store policies before accepting orders.']
};

document.querySelectorAll('[data-store-info]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const [title, body] = storeInfo[link.dataset.storeInfo];
        openModal(`<h2 class="support-modal-title">${title}</h2><p class="support-modal-copy">${body}</p>`);
    });
});

// Initialize Product Display
renderProducts();
updateCartUI();
