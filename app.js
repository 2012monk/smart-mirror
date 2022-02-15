const http = require('http');
const https = require('https');
const url = require('url');
const qs = require('querystring');
const fs = require('fs');
const indexHtml = fs.readFileSync('./index.html', 'utf-8');
const currentConfigFilePath = "/home/pi/MagicMirror/config/config.js";
const defaultConfigFilePath = "./config.js";
const userData = {
    'client_id': null,
    'client_secret': null,
    'refresh_token': null
}

http.createServer((rq, rs) => {
    const parsedUrl = url.parse(rq.url);
    const resource = parsedUrl.pathname;
    if (resource === '/') {
        rs.end(indexHtml);
    } else if (resource === '/data') {
        saveUserData(rq);
    } else if (resource === '/tokens') {
        rq.on('end', () => getToken(qs.parse(parsedUrl.query).code));
        rs.end('complete')
    }
}).listen(8080);

function saveUserData(rq) {
    let body = '';
    rq.on('data', data => {
        body += data;
    });
    rq.on('end', () => {
        const {client_id, client_secret} = qs.parse(body);
        userData.client_id = client_id;
        userData.client_secret = client_secret;
    });
}

function getToken(code) {
    const payload = qs.stringify({
        'grant_type': 'authorization_code',
        'client_id': userData.client_id,
        'scope': 'offline_access user.read tasks.readwrite tasks.read',
        'code': code,
        'redirect_uri': 'http://localhost:8080/tokens',
        'client_secret': userData.client_secret
    });
    const options = {
        hostname: "login.microsoftonline.com",
        port: 443,
        path: '/common/oauth2/v2.0/token',
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': payload.length
        }
    }
    const req = https.request(options, res => {
        res.setEncoding('utf-8');
        res.on('data', data => {
            userData.refresh_token = JSON.parse(data).refresh_token;
        })
        res.on('close', () => {
            if (!userData.refresh_token) {
                return console.error('정보가 잘못 되었습니다 client id 와 client secret 을 다시 한번 확인해주세요');
            }
            updateConfig();
            console.log('done');
            process.exit(0);
        })
    });
    req.on('error', err => {
        console.error(err.message);
    })
    req.write(payload);
    req.end();
}

function updateConfig() {
    let path = currentConfigFilePath;
    if (!fs.existsSync(currentConfigFilePath)) {
        path = defaultConfigFilePath;
    }
    const data = fs.readFileSync(path).toString();
    const refreshTokenKeyValue = 'oauth2RefreshToken: "' + userData.refresh_token + '",';
    fs.writeFileSync(currentConfigFilePath, data
        .replace(/(oauth2ClientSecret:\s)(.*),/, `$1\'${userData.client_secret}\',`)
        .replace(/(oauth2ClientId:\s)(.*),/, `$1\'${userData.client_id}\',`)
        .replace(/(oauth2RefreshToken:\s)(.*),/, refreshTokenKeyValue));
}