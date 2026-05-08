// E-Commerce Store Frontend
let currentProduct = null;
let cart = [];
let products = [];
let orders = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    loadProducts();
    updateCartCount();
});

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        renderDemoProducts();
    }
}

// Render demo products if API fails
function renderDemoProducts() {
    products = [
        { id: 1, name: 'Laptop Pro', category: 'laptops', price: 1299, stock: 5, emoji: '💻', description: 'High-performance laptop for professionals' },
        { id: 2, name: 'iPhone 15', category: 'phones', price: 999, stock: 8, emoji: '📱', description: 'Latest generation smartphone' },
        { id: 3, name: 'iPad Air', category: 'phones', price: 599, stock: 10, emoji: '📱', description: 'Powerful tablet for work and play' },
        { id: 4, name: 'Wireless Headphones', category: 'accessories', price: 199, stock: 15, emoji: '🎧', description: 'Premium noise-canceling headphones' },
        { id: 5, name: 'USB-C Cable', category: 'accessories', price: 19, stock: 50, emoji: '🔌', description: 'Fast charging USB-C cable' },
        { id: 6, name: 'Laptop Stand', category: 'accessories', price: 49, stock: 20, emoji: '🖥️', description: 'Ergonomic laptop stand' },
        { id: 7, name: 'MacBook Pro', category: 'laptops', price: 1999, stock: 3, emoji: '💻', description: 'Professional-grade laptop' },
        { id: 8, name: 'Samsung Galaxy', category: 'phones', price: 799, stock: 12, emoji: '📱', description: 'Flagship Android smartphone' }
    ];
    renderProducts(products);
}

// Render products to grid
function renderProducts(productsToRender) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    if (productsToRender.length === 0) {
        productsList.innerHTML = '<p class="empty-message">No products found</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProductModal(product);

        const stockClass = product.stock === 0 ? 'stock-out' : product.stock < 5 ? 'stock-low' : '';
        const stockText = product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`;

        card.innerHTML = `
            <div class="product-image">${product.emoji || '🛍️'}</div>
            <div class="product-body">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="price">$${product.price}</span>
                    <span class="product-stock ${stockClass}">${stockText}</span>
                </div>
            </div>
        `;
        productsList.appendChild(card);
    });
}

// Filter products
function filterProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery) ||
                              product.description.toLowerCase().includes(searchQuery);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

// Open product modal
function openProductModal(product) {
    currentProduct = product;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalStock').textContent = product.stock;
    document.getElementById('modalPrice').textContent = `$${product.price}`;
    document.getElementById('modalImage').textContent = product.emoji || '🛍️';
    document.getElementById('quantityInput').value = 1;
    document.getElementById('quantityInput').max = product.stock;
    document.getElementById('productModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('productModal').classList.remove('show');
}

// Add to cart from modal
function addToCartFromModal() {
    if (currentProduct.stock === 0) {
        showAlert('This product is out of stock', 'error');
        return;
    }

    const quantity = parseInt(document.getElementById('quantityInput').value);
    addToCart(currentProduct, quantity);
    closeModal();
}

// Add to cart
function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            emoji: product.emoji
        });
    }

    saveToLocalStorage();
    updateCartCount();
    showAlert(`${product.name} added to cart!`, 'success');
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Render cart
function renderCart() {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItems = document.getElementById('cartItems');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.emoji || '🛍️'}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="cart-item-actions">
                <button class="btn btn-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" onchange="setQuantity(${item.id}, this.value)">
                <button class="btn btn-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    updateCartTotal();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(c => c.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveToLocalStorage();
            renderCart();
        }
    }
}

// Set quantity
function setQuantity(productId, quantity) {
    const item = cart.find(c => c.id === productId);
    if (item) {
        item.quantity = parseInt(quantity) || 1;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveToLocalStorage();
            renderCart();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToLocalStorage();
    updateCartCount();
    renderCart();
}

// Update cart total
function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showAlert('Your cart is empty', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = total * 0.1;
    const finalTotal = total + taxAmount;
    
    document.getElementById('checkoutTotal').textContent = `$${finalTotal.toFixed(2)}`;
    document.getElementById('checkoutModal').classList.add('show');
}

// Close checkout
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('show');
}

// Handle checkout form
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const order = {
                id: 'ORD-' + Date.now(),
                customerName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zipCode: document.getElementById('zipCode').value,
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1,
                date: new Date().toLocaleDateString(),
                status: 'Processing'
            };

            try {
                const response = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(order)
                });

                if (response.ok) {
                    orders.push(order);
                    saveToLocalStorage();
                    closeCheckout();
                    cart = [];
                    updateCartCount();
                    showAlert('Order placed successfully!', 'success');
                    setTimeout(() => showSection('orders'), 2000);
                }
            } catch (error) {
                console.error('Error placing order:', error);
                orders.push(order);
                saveToLocalStorage();
                closeCheckout();
                cart = [];
                updateCartCount();
                showAlert('Order placed successfully!', 'success');
                setTimeout(() => showSection('orders'), 2000);
            }
        });
    }
});

// Render orders
function renderOrders() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="empty-message">No orders yet</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span class="order-status">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city} ${order.zipCode}</p>
                <p><strong>Order Date:</strong> ${order.date}</p>
            </div>
            <div class="order-items">
                <strong>Items:</strong>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Subtotal: $${order.total.toFixed(2)} | Tax: $${order.tax.toFixed(2)} | Total: $${(order.total + order.tax).toFixed(2)}
            </div>
        `;
        ordersList.appendChild(orderCard);
    });
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    if (sectionId === 'cart') {
        renderCart();
    } else if (sectionId === 'orders') {
        renderOrders();
    }
}

// Show alert
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);

    setTimeout(() => alert.remove(), 3000);
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orders', JSON.stringify(orders));
}

function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedOrders = localStorage.getItem('orders');

    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

// Close modals on background click
window.addEventListener('click', (e) => {
    const productModal = document.getElementById('productModal');
    const checkoutModal = document.getElementById('checkoutModal');

    if (e.target === productModal) {
        closeModal();
    }
    if (e.target === checkoutModal) {
        closeCheckout();
    }
});
