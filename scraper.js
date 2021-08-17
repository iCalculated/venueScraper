#! /usr/bin/env node
'use strict';

const fs = require('fs');

const { search, 
        id_search,
} = require("./utils/yelp");
const { format,
        format_hours_update,
        format_csv: csv_format,
} = require('./utils/formatters');
const { file_name_from_city,
        convert_to_CSV,
        write_to_file,
} = require('./utils/helpers');

/**
 * 
 * @param {Array<string>} places, venue names
 * @param {string} city, (shared) venue city 
 * @returns array of JSON results
 */
const search_list = async (places, city) => {
    const results = [];
    for (const place of places) {
        const result = await search(place, city);
        if (result) {
            results.push(result);
        }
    }
    return results;
}


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

console.log(`${city}:\n\t${places.join("\n\t")}`);

search_list(places, city)
    .then(results => results.map(format_hours_update))
    .then(JSON.stringify)
    .then(text => {
        const outfile = (typeof file !== "undefined" && file) 
            ? file 
            : file_name_from_city(city);
        write_to_file(text, outfile);
    });