const fs = require('fs');
const moment = require('moment');
const zenmoneyJson = require('./app/zenmoney-json');
const zenmoneyCsv = require('./app/zenmoney-csv');
const schedule = require('node-schedule')


start();
async function start(){
    schedule.scheduleJob('* * * * *', async () => {
        main()
    })
}

async function main(){
    try {
        const json = await zenmoneyJson.get();
        save('json', JSON.stringify(json, null, ' '));

        const csv = await zenmoneyCsv.get();
        save('csv', csv);

    } catch (err) {
        console.error(err); // eslint-disable-line no-console
    }
}

function save(ext, body) {
    let dir = process.cwd() + '/export';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    dir += '/' + ext;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    let fileName = 'zen_' + moment().format('YYYY-MM-DD-HHmmss') + '.' + ext;

    let filePath = dir + '/' + fileName;

    fs.writeFileSync(filePath, body);

    console.log(fileName + ' saved!'); // eslint-disable-line no-console
}
