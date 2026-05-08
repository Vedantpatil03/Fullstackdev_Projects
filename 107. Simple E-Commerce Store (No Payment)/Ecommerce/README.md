# 🛒 TechStore - E-Commerce Application

A full-stack e-commerce store with no payment integration. Features product browsing, shopping cart management, and order tracking.

## 🎯 Features

### Frontend
- ✅ **Product Browsing** - Grid layout with product cards
- ✅ **Search & Filter** - Search by name/description, filter by category
- ✅ **Product Details Modal** - View detailed product information
- ✅ **Shopping Cart** - Add/remove items, adjust quantities
- ✅ **Cart Calculations** - Automatic subtotal, tax, and total calculation
- ✅ **Checkout Form** - Customer information collection
- ✅ **Order Tracking** - View all placed orders with details
- ✅ **Local Storage** - Persistent cart and order data
- ✅ **Responsive Design** - Mobile, tablet, and desktop support

### Backend
- ✅ **RESTful API** - Express.js server with CORS enabled
- ✅ **Product Management** - CRUD operations for products
- ✅ **Order Management** - Create and track orders
- ✅ **Data Persistence** - JSON file storage (no database required)
- ✅ **Stock Management** - Automatic stock updates on orders
- ✅ **Error Handling** - Comprehensive error handling

## 📁 Project Structure

```
Ecommerce/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend Node.js/Express server
├── package.json        # Node.js dependencies
├── data/               # Data storage (auto-created)
│   ├── products.json   # Products database
│   └── orders.json     # Orders database
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to project directory:**
```bash
cd Ecommerce
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the backend server:**
```bash
npm start
```
or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

4. **Open the frontend:**
Open `index.html` in your browser (or use Live Server extension)

## 📋 Default Products

The system comes pre-loaded with 8 sample products:
- Laptop Pro ($1,299) - 5 in stock
- iPhone 15 ($999) - 8 in stock
- iPad Air ($599) - 10 in stock
- Wireless Headphones ($199) - 15 in stock
- USB-C Cable ($19) - 50 in stock
- Laptop Stand ($49) - 20 in stock
- MacBook Pro ($1,999) - 3 in stock
- Samsung Galaxy ($799) - 12 in stock

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Health
- `GET /api/health` - Server health check

## 💾 Data Format

### Product Object
```json
{
  "id": 1,
  "name": "Laptop Pro",
  "category": "laptops",
  "price": 1299,
  "stock": 5,
  "emoji": "💻",
  "description": "High-performance laptop for professionals"
}
```

### Order Object
```json
{
  "id": "ORD-1706234567890",
  "customerName": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St",
  "city": "New York",
  "zipCode": "10001",
  "items": [
    {
      "id": 1,
      "name": "Laptop Pro",
      "price": 1299,
      "quantity": 1,
      "emoji": "💻"
    }
  ],
  "total": 1299,
  "tax": 129.90,
  "date": "2/1/2026",
  "status": "Processing"
}
```

## 🎨 Features in Detail

### Product Browsing
- View all products in a responsive grid
- Click any product to see detailed information
- View product stock status

### Shopping Cart
- Add products with custom quantities
- Update quantities in cart
- Remove items
- Automatic tax calculation (10%)
- Real-time total calculations

### Checkout Process
1. Review cart with items and pricing
2. Enter customer information
3. Confirm order
4. Order is saved with unique ID

### Order Tracking
- View all placed orders
- See order details including:
  - Order ID and status
  - Customer information
  - Ordered items with quantities
  - Subtotal, tax, and total

## 🔐 Notes

- **No Payment Processing** - This is a demo store without payment gateway integration
- **Local Storage** - Cart and orders persist in browser localStorage
- **JSON File Storage** - Backend stores data in JSON files (perfect for small projects)
- **CORS Enabled** - Frontend and backend communicate freely

## 🛠️ Customization

### Change Port
Edit `server.js`:
```javascript
const PORT = 5000; // Change this number
```

### Add New Products
Use the API:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "category": "category",
    "price": 99.99,
    "stock": 10,
    "emoji": "🎁",
    "description": "Product description"
  }'
```

Or edit `data/products.json` directly

### Change Tax Rate
Edit `script.js`:
```javascript
const tax = subtotal * 0.1; // Change 0.1 to desired tax rate
```

## ⚠️ Limitations

- No user authentication
- No payment processing
- No email notifications
- No database (uses JSON files)
- Single server instance only
- No SSL/HTTPS setup

## 🚀 Future Enhancements

- User authentication and accounts
- Payment gateway integration (Stripe, PayPal)
- Email notifications
- Database integration (MongoDB, PostgreSQL)
- Admin dashboard
- Product reviews and ratings
- Wishlist functionality
- Multiple language support

## 📝 License

Free to use and modify for educational purposes.

## 👨‍💻 Author

Created as a demo e-commerce application - 2026
