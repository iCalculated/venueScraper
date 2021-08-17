#! /usr/bin/env node
'use strict';

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const { search_list,
        search_id_list,
} = require("./utils/yelp");
const { format,
        format_hours_update,
        format_csv: csv_format,
} = require('./utils/formatters');
const { file_name_from_city,
        convert_to_CSV,
        write_to_file,
} = require('./utils/helpers');

// defaults
if (!argv.format) {
    argv.format = "default";
}
if (!argv.input) {
    argv.input = "id"
}
if (!argv.outfile) {
    if (argv.place) {
        argv.outfile = file_name_from_city(argv.place);
    }
    else {
        argv.outfile = "./output/out.json";
    }
}
if (argv.input == "name") {
    if (argv.place == null) { 
        console.error(chalk.red("Place is required."));
        process.exit();
    }
}
console.log(argv);

const scrape_to_CSV = (places, city, file) => {
    search_list(places, city)
        .then(results => results.map(csv_format))
        .then(convert_to_CSV)
        .then(text => write_to_file(text, file));
};

const places = [
    "Goldmine Saloon",
];
const city = "New Orleans, LA";

console.log(chalk.grey(`${city}:\n\t${places.join("\n\t")}`));

search_list(places, city)
    .then(results => results.map(format_hours_update))
    .then(JSON.stringify)
    .then(text => {
        const outfile = (typeof file !== "undefined" && file) 
            ? file 
            : file_name_from_city(city);
        write_to_file(text, outfile);
    });