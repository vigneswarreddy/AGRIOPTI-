const https = require('https');
const apiKey = "AIzaSyCyzlNvQc6XIRT55_wol5PE0krCxpQr3to";

const data = JSON.stringify({
    token: "invalid-token",
    returnSecureToken: true
});

const options = {
    hostname: 'identitytoolkit.googleapis.com',
    port: 443,
    path: `/v1/accounts:signInWithCustomToken?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    let rawData = '';
    res.on('data', chunk => { rawData += chunk; });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            if (parsedData.error && parsedData.error.message === "API_KEY_INVALID") {
                console.error("The frontend API key is INVALID.");
                process.exit(1);
            } else {
                console.log("The frontend API key is VALID and active. (Received expected error: " + (parsedData.error ? parsedData.error.message : 'Success') + ")");
                process.exit(0);
            }
        } catch (e) {
            console.error("Error parsing response:", e.message);
            process.exit(1);
        }
    });
});

req.on('error', error => {
    console.error("Network error:", error);
    process.exit(1);
});

req.write(data);
req.end();
