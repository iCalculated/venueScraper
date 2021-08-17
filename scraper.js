#! /usr/bin/env node
'use strict';

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const { search_list,
        search_id_list,
} = require("./utils/yelp");
const { format,
        format_hours_update,
        format_csv,
} = require('./utils/formatters');
const { file_name_from_city,
        write_to_file,
        parse_item,
} = require('./utils/helpers');

const formats = {
    "default": format,
    "json": format,
    "csv": format_csv,
    "hours": format_hours_update,
};
// defaults
if (!argv.format) {
    argv.format = "default";
}
if (!argv.input) {
    argv.input = "default"
}
if (!argv.outfile) {
    if (argv.city) {
        argv.outfile = file_name_from_city(argv.city);
    }
    else {
        argv.outfile = "./output/out.json";
    }
}
if (argv.input == "name") {
    if (argv.city == null) { 
        console.error(chalk.red("City is required."));
        process.exit();
    }
}
if (argv.city) {
    console.log(chalk.grey(`${argv.city}:\n\t${argv._.join("\n\t")}`));
}
else {
    console.log(chalk.grey(`${argv._.join("\n")}`));
}

const search_terms = argv._.map(parse_item).flat();
console.log(search_terms);

// lazily-evaluated search functions
const search_function = argv.names ? 
    (search_terms) => search_list(search_terms, argv.city) :
    (search_terms) => search_id_list(search_terms);

search_function(search_terms)
    .then(results => results.map(
        formats[argv.format]
    ))
    .then(JSON.stringify)
    .then(text => {
        write_to_file(text, argv.outfile);
    });