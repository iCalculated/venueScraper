
const fs = require('fs');
const request = require('request');
const chalk = require('chalk');

const download = (uri, filename, callback) => {
    request.head(uri, (err, res, body) => {
        if (err) {
            console.log(chalk.red(`Issue with ${uri}`));
            return
        }
        request(uri).pipe(fs.createWriteStream(filename));
            //.on('close', callback);
    });
};


const city = "miami";
const data = require(`./output/${city}.json`);
const folder = `./output/${city}`;

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
}

data.map(venue => {
    const file_stem = folder + "/"
                    + venue.name.toLowerCase()
                        .replace(/ /g,"_")
                        .replace(/\W/g, '') ;
                    
    venue.image_links.map((link, idx) => {
        const file_name = file_stem + "_" + (idx+1) + ".jpg";
        download(link, file_name, console.log(chalk.yellow(`Wrote ${file_name}`)));
    })
})
