const http = require('http');
const https = require('https');
const url = require('url');
const qs = require('querystring');
const fs = require('fs');
const index = fs.readFileSync('./index.html', 'utf-8');
const userData = {
    'client_id': null,
    'client_secret': null,
    'refresh_token': null
}

http.createServer((rq, rs) => {
    const parsedUrl = url.parse(rq.url);
    const resource = parsedUrl.pathname;

    if (resource === '/') {
        rs.end(index);
    } else if (resource === '/data') {
        let body = '';
        rq.on('data', data => {
            body += data;
        });
        rq.on('end', () => {
            const {client_id, client_secret} = qs.parse(body);
            userData.client_id = client_id;
            userData.client_secret = client_secret;
        });
    } else if (resource === '/tokens') {
        rq.on('end', () => getToken(qs.parse(parsedUrl.query).code));
        rs.end('complete')
    }
}).listen(8080);

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
            const {refresh_token} = JSON.parse(data);
            userData.refresh_token = refresh_token;
            console.log(`${refresh_token}`)
        })
        res.on('close', () => {
            if (!userData.refresh_token) {
                console.error('정보가 잘못 되었습니다 client id 와 client secret 을 다시 한번 확인해주세요');
            } else {
                writeFile();
            }
        })
    });
    req.on('error', err => {
        console.error(err.message);
    })
    req.write(payload);
    req.end();
}

function writeFile() {
    fs.readFile("./config.js", (err, data) => {
        if (err) return console.error(err);
        const file = data.toString();
        const r1 = /(oauth2ClientSecret:\s)(.*),/
        const r2 = /(oauth2RefreshToken:\s)(.*),/
        const r3 = /(oauth2ClientId:\s)(.*),/
        const rf = 'oauth2RefreshToken: "' + userData.refresh_token + '",';
        console.error(file)
        let changed = file.replace(r1, `$1\'${userData.client_secret}\',`)
        .replace(r3, `$1\'${userData.client_id}\',`)
        .replace(r2, rf);
        fs.writeFileSync("./tmp.js", changed);
        process.exit(0);
    });
}