const axios = require('axios');

async function verifyLogin() {
    console.log("🔍 Verifying Login for Ae123@example.com...");
    try {
        const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', {
            email: 'Ae123@example.com',
            password: 'Ae123@example.com'
        });

        if (response.data.message === 'success') {
            console.log("✅ SUCCESS: Login successful!");
            console.log("🔑 Token received: " + response.data.token.substring(0, 20) + "...");
            console.log("👤 User Name: " + response.data.user.name);
        } else {
            console.log("❌ FAILED: Unexpected response", response.data);
        }
    } catch (error) {
        console.error("❌ FAILED: Login error");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Message:", error.response.data.message);
        } else {
            console.error(error.message);
        }
    }
}

verifyLogin();
