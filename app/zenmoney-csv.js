const request = require('request-promise-native');
const error = require('./../lib/error');
const conf = require('./../zenmoney.json');

module.exports.get = get;

const zenmoneyUrl = 'https://zenmoney.ru';

async function get() {
    try {
        const cookies = await getCookies();
        const csv = await getCsv(cookies);

        return csv;

    } catch (err) {
        throw error.getWithCallee(err, arguments.callee.name, __filename);
    }
}

async function getCookies() {
    try {
        const options = {
            method: 'POST',
            url: zenmoneyUrl + '/login/enter',
            headers: {
                'Host': 'zenmoney.ru',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:69.0) Gecko/20100101 Firefox/69.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://zenmoney.ru/a/',
                'Content-Type': 'application/x-www-form-urlencoded',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            form: {
                login: conf.username,
                password: conf.password
            },
            gzip: true,
            resolveWithFullResponse: true
        };

        await request(options);

        throw error.getWithCallee(new Error('getCookies > redirect error'), arguments.callee.name, __filename);

    } catch (err) {
        if (err.statusCode == 302) {
            const cookie = err.response.headers['set-cookie']['0'].split(';')[0];

            if (cookie.length == 0) {
                throw error.getWithCallee(new Error(err.options.url + ' > cookie.length == 0'), arguments.callee.name, __filename);
            }

            const j = request.jar();
            j.setCookie(request.cookie(cookie), zenmoneyUrl);

            return j;
        }

        throw error.getWithCallee(err, arguments.callee.name, __filename);
    }
}

async function getCsv(cookies) {
    try {
        const options = {
            method: 'GET',
            url: zenmoneyUrl + '/export/download2011',
            headers: {
                'Host': 'zenmoney.ru',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:69.0) Gecko/20100101 Firefox/69.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://zenmoney.ru/a/',
                'Content-Type': 'application/x-www-form-urlencoded',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            gzip: true,
            jar: cookies
        };

        const response = await request(options);

        if (response.indexOf('zm_dump_2011') < 0) {
            throw error.getWithCallee(new Error('getCsv > export error'), arguments.callee.name, __filename);
        }

        return response;

    } catch (err) {
        throw error.getWithCallee(err, arguments.callee.name, __filename);
    }
}
