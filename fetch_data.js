
const https = require('https');

const url = 'https://ecommerce.routemisr.com/api/v1/products?limit=50';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            const products = jsonData.data;

            console.log('--- DATA START ---');
            products.forEach(p => {
                console.log(JSON.stringify({
                    id: p._id,
                    title: p.title,
                    category: p.category.name,
                    brand: p.brand.name,
                    description: p.description
                }));
            });
            console.log('--- DATA END ---');

        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });

}).on('error', (err) => {
    console.error('Error fetching data:', err.message);
});
