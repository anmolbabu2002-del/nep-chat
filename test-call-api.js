const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in fetch in newer Node
const API_URL = 'http://localhost:3000';

async function verifyCallAPI() {
    console.log('📞 Testing Call API (Agora Token Generation)...');

    // 1. Register a test user with RANDOM suffix to avoid collision
    const randomSuffix = Math.floor(Math.random() * 100000);
    const user = {
        username: `test_${randomSuffix}`, // e.g. test_12345
        password: 'password123',
        name: 'Call Tester'
    };

    try {
        console.log(`1. Registering user: ${user.username}...`);
        const regRes = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const regText = await regRes.text();
        let regData;
        try {
            regData = JSON.parse(regText);
        } catch (e) {
            console.error('Registration Response Text:', regText);
            throw new Error(`Invalid JSON response during registration`);
        }

        if (!regData.success) {
            throw new Error(`Registration failed: ${regData.error}`);
        }
        console.log(`✅ Registered: ${user.username} (UID: ${regData.user.uid})`);

        // 2. Login to get session
        console.log('2. Logging in...');
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, password: user.password })
        });

        const loginText = await loginRes.text();
        let loginData;
        try {
            loginData = JSON.parse(loginText);
        } catch (e) {
            console.error('Login Response Text:', loginText);
            throw new Error(`Invalid JSON response during login`);
        }

        if (!loginData.success) {
            throw new Error(`Login failed: ${loginData.error}`);
        }

        const sessionId = loginData.sessionId;
        console.log('✅ Logged in. Session ID:', sessionId.substring(0, 10) + '...');

        // 3. Request Agora Token
        console.log('3. Requesting Agora Token...');
        const channelName = 'test_channel';
        const tokenRes = await fetch(`${API_URL}/api/agora/token?channelName=${channelName}&role=publisher`, {
            headers: {
                'Authorization': `Bearer ${sessionId}`
            }
        });

        if (tokenRes.status !== 200) {
            const errorText = await tokenRes.text();
            throw new Error(`API returned status ${tokenRes.status}: ${errorText}`);
        }

        const tokenData = await tokenRes.json();

        if (!tokenData.token) {
            throw new Error('No token received in response');
        }

        console.log('✅ Token received:', tokenData.token.substring(0, 20) + '...');
        console.log('🎉 Call API Verification PASSED!');

    } catch (error) {
        console.error('❌ Verification FAILED:', error.message);
        process.exit(1);
    }
}

verifyCallAPI();
