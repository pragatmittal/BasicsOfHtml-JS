// Define productList globally
let productList = [];

function loadProducts() {
    return fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            productList = data;
            return data;
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            // Fallback to local data if API fails
            productList = [
                {
                    name: "iPhone 14",
                    price: "$999",
                    description: "Latest Apple smartphone with A15 chip"
                },
                // ...other products
            ];
        });
}

function renderProducts() {
    // Show loading state
    document.getElementById('data').innerHTML = '<p>Loading products...</p>';
    
    // Load products then render
    loadProducts().then(() => {
        const tableRows = productList.map(product => `
            <tr>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
            </tr>
        `).join('');

        document.getElementById('data').innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
        `;
    });
}

// Call render when page loads
document.addEventListener('DOMContentLoaded', renderProducts);