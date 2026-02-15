const axios = require('axios');

// Configure Axios for strict testing
const api = axios.create({
    baseURL: 'https://app-elicom-backend.azurewebsites.net',
    headers: {
        'Content-Type': 'application/json',
        'Abp-TenantId': '1'
    }
});

async function testSmartStoreAuth() {
    console.log("🚀 Starting Smart Store API Dry Run...\n");

    // 1. Test Login (with intentional failure to check connectivity)
    console.log("🔹 Testing [POST] /api/TokenAuth/Authenticate (Login)");
    try {
        const loginPayload = {
            userNameOrEmailAddress: "test@example.com",
            password: "wrongpassword",
            rememberClient: false
        };
        console.log("   Sending Payload:", loginPayload);

        await api.post('/api/TokenAuth/Authenticate', loginPayload);
    } catch (error) {
        if (error.response) {
            console.log("   ✅ Server Responded:", error.response.status, error.response.statusText);
            console.log("   Response Data:", JSON.stringify(error.response.data, null, 2));

            if (error.response.status === 401 || error.response.data?.error) {
                console.log("   ✅ Connectivity verified (Invalid credentials handled correctly).");
            }
        } else {
            console.error("   ❌ Connection Failed:", error.message);
        }
    }

    console.log("\n---------------------------------------------------\n");

    // 2. Test Signup (Validation Check)
    console.log("🔹 Testing [POST] /api/services/app/Account/RegisterSmartStoreCustomer (Signup)");
    try {
        const signupPayload = {
            emailAddress: "dryrun_test_v2@example.com", // Changed to v2 to avoid potential conflict if prev one partially worked (unlikely)
            password: "TestPassword123!",
            country: "UK",
            phoneNumber: "+44123456789",
            fullName: "Dry Run Test User"
        };
        console.log("   Sending Payload:", signupPayload);

        // Note: We might not want to actually create a user to avoid spamming the database,
        // but getting a 200 OK or a specific validation error confirms the endpoint exists.
        // For dry run, we'll try to hit it.
        const response = await api.post('/api/services/app/Account/RegisterSmartStoreCustomer', signupPayload);
        console.log("   ✅ Signup Successful (Statue: 200)");
        console.log("   Response:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.log("   ⚠️ Server Responded:", error.response.status);
            console.log("   Response Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("   ❌ Connection Failed:", error.message);
        }
    }
}

testSmartStoreAuth();
