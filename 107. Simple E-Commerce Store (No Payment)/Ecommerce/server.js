const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data storage files
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files if they don't exist
function initializeDataFiles() {
    const defaultProducts = [
        { id: 1, name: 'Laptop Pro', category: 'laptops', price: 1299, stock: 5, emoji: '💻', description: 'High-performance laptop for professionals' },
        { id: 2, name: 'iPhone 15', category: 'phones', price: 999, stock: 8, emoji: '📱', description: 'Latest generation smartphone' },
        { id: 3, name: 'iPad Air', category: 'phones', price: 599, stock: 10, emoji: '📱', description: 'Powerful tablet for work and play' },
        { id: 4, name: 'Wireless Headphones', category: 'accessories', price: 199, stock: 15, emoji: '🎧', description: 'Premium noise-canceling headphones' },
        { id: 5, name: 'USB-C Cable', category: 'accessories', price: 19, stock: 50, emoji: '🔌', description: 'Fast charging USB-C cable' },
        { id: 6, name: 'Laptop Stand', category: 'accessories', price: 49, stock: 20, emoji: '🖥️', description: 'Ergonomic laptop stand' },
        { id: 7, name: 'MacBook Pro', category: 'laptops', price: 1999, stock: 3, emoji: '💻', description: 'Professional-grade laptop' },
        { id: 8, name: 'Samsung Galaxy', category: 'phones', price: 799, stock: 12, emoji: '📱', description: 'Flagship Android smartphone' }
    ];

    if (!fs.existsSync(PRODUCTS_FILE)) {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2));
    }

    if (!fs.existsSync(ORDERS_FILE)) {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
    }
}

// Helper functions to read/write data
function readProducts() {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    }
}

function writeProducts(products) {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error writing products:', error);
    }
}

function readOrders() {
    try {
        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading orders:', error);
        return [];
    }
}

function writeOrders(orders) {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    } catch (error) {
        console.error('Error writing orders:', error);
    }
}

// Routes

// GET all products
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

// POST new product (for admin purposes)
app.post('/api/products', (req, res) => {
    const { name, category, price, stock, emoji, description } = req.body;

    if (!name || !category || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const products = readProducts();
    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        emoji,
        description
    };

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const { name, category, price, stock, emoji, description } = req.body;
    products[productIndex] = {
        ...products[productIndex],
        name: name || products[productIndex].name,
        category: category || products[productIndex].category,
        price: price !== undefined ? parseFloat(price) : products[productIndex].price,
        stock: stock !== undefined ? parseInt(stock) : products[productIndex].stock,
        emoji: emoji || products[productIndex].emoji,
        description: description || products[productIndex].description
    };

    writeProducts(products);
    res.json(products[productIndex]);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
    const products = readProducts();
    const filteredProducts = products.filter(p => p.id !== parseInt(req.params.id));

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ error: 'Product not found' });
    }

    writeProducts(filteredProducts);
    res.json({ message: 'Product deleted successfully' });
});

// GET all orders
app.get('/api/orders', (req, res) => {
    const orders = readOrders();
    res.json(orders);
});

// GET single order
app.get('/api/orders/:id', (req, res) => {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
});

// POST new order
app.post('/api/orders', (req, res) => {
    const { id, customerName, email, address, city, zipCode, items, total, tax, date, status } = req.body;

    if (!customerName || !email || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const orders = readOrders();
    const newOrder = {
        id: id || 'ORD-' + Date.now(),
        customerName,
        email,
        address,
        city,
        zipCode,
        items,
        total: parseFloat(total),
        tax: parseFloat(tax),
        date: date || new Date().toLocaleDateString(),
        status: status || 'Processing'
    };

    orders.push(newOrder);
    writeOrders(orders);

    // Update product stocks
    const products = readProducts();
    items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    writeProducts(products);

    res.status(201).json(newOrder);
});

// PUT update order status
app.put('/api/orders/:id', (req, res) => {
    const orders = readOrders();
    const orderIndex = orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }

    const { status } = req.body;
    orders[orderIndex].status = status || orders[orderIndex].status;

    writeOrders(orders);
    res.json(orders[orderIndex]);
});

// DELETE order
app.delete('/api/orders/:id', (req, res) => {
    const orders = readOrders();
    const filteredOrders = orders.filter(o => o.id !== req.params.id);

    if (filteredOrders.length === orders.length) {
        return res.status(404).json({ error: 'Order not found' });
    }

    writeOrders(filteredOrders);
    res.json({ message: 'Order deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize data and start server
initializeDataFiles();

app.listen(PORT, () => {
    console.log(`🚀 E-Commerce Backend Server running on http://localhost:${PORT}`);
    console.log(`📁 Data directory: ${dataDir}`);
    console.log(`📊 Products file: ${PRODUCTS_FILE}`);
    console.log(`📋 Orders file: ${ORDERS_FILE}`);
});
