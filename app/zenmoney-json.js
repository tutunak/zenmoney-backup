const request = require('request-promise-native');
const error = require('./../lib/error');
const conf = require('./../zenmoney.json');

module.exports.get = get;

const urlAuth = 'https://api.zenmoney.ru/oauth2/authorize';
const urlToken = 'https://api.zenmoney.ru/oauth2/token';
const urlRedirect = 'localhost';
const urlDiff = 'https://api.zenmoney.ru/v8/diff';

async function get() {
    try {
        const cookies = await getCookies();
        const code = await getCode(cookies);
        const tokens = await getTokens(code);
        const data = await getDiff(tokens);

        return data;

    } catch (err) {
        throw error.getWithCallee(err, arguments.callee.name, __filename);
    }
}

async function getCookies() {
    try {
        const options = {
            method: 'GET',
            url: urlAuth,
            qs: {
                response_type: 'code',
                client_id: conf.consumerKey,
                redirect_uri: urlRedirect
            },
            gzip: true,
            resolveWithFullResponse: true
        };

        const response = await request(options);

        const cookie = response.headers['set-cookie']['0'].split(';')[0];

        if (cookie.length == 0) {
            throw error.getWithCallee(new Error(options.url + ' > cookie.length == 0'), arguments.callee.name, __filename);
        }

        const j = request.jar();
        j.setCookie(request.cookie(cookie), options.url);

        return j;

    } catch (err) {
        throw error.getWithCallee(err, arguments.callee.name, __filename);
    }
}

async function getCode(cookies) {
    try {
        const options = {
            method: 'POST',
            url: urlAuth,
            qs: {
                response_type: 'code',
                client_id: conf.consumerkey,
                redirect_uri: urlRedirect
            },
            form: {
                username: conf.username,
                password: conf.password,
                auth_type_password: 'Sign in',
            },
            gzip: true,
            jar: cookies
        };

        await request(options);

        throw error.getWithCallee(new Error('getCodeUserId redirect error'), arguments.callee.name, __filename);

    } catch (err) {
        if (err.statusCode == 302) {
            const urlParams = err.message.split('?')[1].split('&');
            let code = '';

            for (let u of urlParams) {
                if (u.indexOf('code') == 0) {
                    code = u.replace('code=', '');
                }
            }

            if (code == '') {
                throw error.getWithCallee(new Error('getCode code not found'), arguments.callee.name, __filename);
            }

            return code;
        }

        throw error.getWithCallee(err, arguments.callee.name, __filename);
    }
}

async function getTokens(code) {
    try {
        const options = {
            method: 'POST',
            url: urlToken,
            form: {
                grant_type: 'authorization_code',
                client_id: conf.consumerKey,
                client_secret: conf.consumerSecret,
                code: code,
                redirect_uri: urlRedirect
            },
            gzip: true,
            json: true
        };

        const response = await request(options);

        return response;

    } catch (err) {
        throw error.getWithCallee(err, arguments.callee.name, __filename);
    }
}

async function getDiff(tokens) {
    try {
        const options = {
            method: 'POST',
            url: urlDiff,
            json: {
                currentClientTimestamp: (new Date()).getTime() / 1000,
                serverTimestamp: 0
            },
            gzip: true,
            auth: {
                'bearer': tokens.access_token
            }
        };

        const response = await request(options);

        return response;

    } catch (err) {
        throw error.getWithCallee(err, arguments.callee.name, __filename);
    }
}
