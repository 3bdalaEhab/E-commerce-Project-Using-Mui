
import fs from 'fs';
import https from 'https';

const sanitizeKey = (text) => {
    return text
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/[^a-z0-9]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};

const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
            res.on('error', reject);
        }).on('error', reject);
    });
};

const run = async () => {
    try {
        console.log('Fetching Page 1...');
        const page1 = await fetchUrl('https://ecommerce.routemisr.com/api/v1/products?limit=50&page=1');

        console.log('Fetching Page 2...');
        const page2 = await fetchUrl('https://ecommerce.routemisr.com/api/v1/products?limit=50&page=2');

        const allProducts = [...page1.data, ...page2.data];
        console.log(`Total Products Fetched: ${allProducts.length}`);

        const keys = {};

        allProducts.forEach(p => {
            const titleKey = sanitizeKey(p.title);
            const descKey = `products.${titleKey}Description`;
            const titleKeyFull = `products.${titleKey}`;

            // Add keys if seemingly missing (we just output all for now to be safe)
            keys[titleKey] = p.title; // Fallback value is the English title
            keys[descKey] = p.description; // Fallback value
        });

        const output = JSON.stringify(keys, null, 2);
        fs.writeFileSync('missing_keys.json', output);
        console.log('Successfully wrote missing_keys.json');

        // Check for the user reported specific items
        const special1 = "Smart TV 32 Inch LED With Built in WiFi, 2 HDMI and 2 USB Inputs KDL-32W600D Black - WE Offer (50 GB Free for 1 Month) KDL-32W600D Black";
        const special2 = "50-Inch Crystal UHD Crystal Processor 4K Flat Smart Tv UA50AU7000UXZN / UA50AU7000UXEG Titan Grey";

        console.log("Checking User Reported Items:");
        const k1 = sanitizeKey(special1);
        console.log(`Key 1: ${k1}`);
        const found1 = allProducts.find(p => sanitizeKey(p.title) === k1);
        console.log(`Found 1? ${!!found1}`);

        const k2 = sanitizeKey(special2);
        console.log(`Key 2: ${k2}`);
        const found2 = allProducts.find(p => sanitizeKey(p.title) === k2);
        console.log(`Found 2? ${!!found2}`);

    } catch (err) {
        console.error(err);
    }
};

run();
