# E-Commerce Store Project

This is a simple e-commerce store with a Node.js backend and HTML/CSS/JavaScript frontend.

## Project Structure

```
├── frontend/           # Frontend files
│   ├── index.html     # Main HTML page
│   ├── main.js        # JavaScript for product display
│   └── styles.css     # CSS styling
├── server/            # Backend server
│   ├── index.js       # Express server with API endpoints
│   └── package.json   # Server dependencies
└── README.md          # This file
```

## How to Run

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Start the server:**
   ```bash
   cd server
   npm start
   ```

3. **Access the application:**
   Open your browser and go to `http://localhost:3000`

## Features

- Product listing with API integration
- Responsive design
- Add to cart functionality (frontend only)
- RESTful API endpoint for products

## API Endpoints

- `GET /api/products` - Returns a list of products in JSON format 