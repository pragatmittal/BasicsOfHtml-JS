document.addEventListener('DOMContentLoaded', () => {
    // Fetch products from the API
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            document.getElementById('product-list').innerHTML = 
                '<div class="error">Error loading products. Please try again later.</div>';
        });
});

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    
    // Clear loading message
    productList.innerHTML = '';
    
    // Display each product
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p class="description">${product.description}</p>
            <button>Add to Cart</button>
        `;
        
        productList.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.product-card button').forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.target.parentElement.querySelector('h3').textContent;
            alert(`Added ${productName} to cart!`);
            // In a real app, you would update the cart here
        });
    });
}
