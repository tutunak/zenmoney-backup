const request = require('request');
const moment = require('moment');
const fs = require('fs');

start((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    process.exit(0);
});

function start(callback) {
    let login = '';
    let pass = '';

    process.argv.forEach((val) => {
        if (val.startsWith('--login')) {
            login = val.replace('--login=', '');
        }

        if (val.startsWith('--pass')) {
            pass = val.replace('--pass=', '');
        }
    });

    if (login == '' || pass == '') {
        return callback('login and/or pass not set');
    }

    auth(login, pass, callback);
}

function auth(login, pass, callback) {
    let url = 'https://zenmoney.ru';

    let headers = {
        'Host': 'zenmoney.ru',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://zenmoney.ru/a/',
        'Content-Type': 'application/x-www-form-urlencoded',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    };

    let form = {
        login: login,
        password: pass
    }

    request.post({
        url: url + '/login/enter',
        headers: headers,
        form: form,
        gzip: true
    }, (err, response, body) => {
        if (err) {
            return callback(err);
        }

        if (body != '') {
            return callback('auth error');
        }

        if (response == undefined ||
            response.headers == undefined ||
            response.headers['set-cookie'] == undefined ||
            response.headers['set-cookie']['1'] == undefined) {
            return callback('cookie not found');
        }

        let cookie = response.headers['set-cookie']['0'];
        cookie = cookie.split(';')[0];

        if (cookie.length == 0) {
            return callback('cookie.length == 0');
        }

        let j = request.jar();
        j.setCookie(request.cookie(cookie), url);

        exportCsv(url, headers, j, callback);
    });
}

function exportCsv(url, headers, j, callback) {
    request.get({
        url: url + '/export/download2011/',
        headers: headers,
        gzip: true,
        jar: j
    }, (err, response, body) => {
        if (err) {
            return callback(err);
        }

        if (body.indexOf('zm_dump_2011') < 0) {
            return callback('export error');
        }

        saveFile(body, callback);
    });
}

function saveFile(body, callback) {
    let filePath = process.cwd() + '/export';

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }

    let fileName = filePath + '/' + moment().format('YYYY-MM-DD-HHmmss') + '.csv';

    fs.writeFileSync(fileName, body);

    console.log(fileName + ' saved!');

    return callback();
}
