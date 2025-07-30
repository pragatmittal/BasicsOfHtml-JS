var express = require("express");
var app = express();
var port = 3000;
var path = require("path");

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Add a GET endpoint for products
app.get('/api/products', function(req, res) {
    const products = [
        {
            name: "iPhone 14",
            price: "$999",
            description: "Latest Apple smartphone with A15 chip"
        },
        {
            name: "Samsung Galaxy S23",
            price: "$899",
            description: "Premium Android smartphone"
        },
        {
            name: "MacBook Pro",
            price: "$1299",
            description: "Powerful laptop for professionals"
        },
        {
            name: "iPad Air",
            price: "$599",
            description: "Versatile tablet for creativity"
        },
        {
            name: "AirPods Pro",
            price: "$249",
            description: "Premium wireless earbuds with noise cancellation"
        }
    ];
    
    res.json(products);
});

app.listen(port, function() {
    console.log("Server is running on http://localhost:" + port);
});