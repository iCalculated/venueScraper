#! /usr/bin/env node
'use strict';

const fs = require('fs');

const { search, 
        id_search 
} = require("./utils/yelp.js");
const { format,
        format_hours_update,
        format_csv: csv_format,
} = require('./utils/formatters.js');
const

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


/**
 * 
 * @param {Array<Object>} objectArray
 * @returns string in CSV format
 */
const convert_to_CSV = objectArray => {
    const array = [Object.keys(objectArray[0])].concat(objectArray)
    return array.map(row => {
        return Object.values(row).map(value => {
            return typeof value === 'string' ? JSON.stringify(value) : value
        }).toString()
    }).join('\n')
}

const scrape_to_CSV = (places, city, file) => {
    search_list(places, city)
        .then(results => results.map(csv_format))
        .then(convert_to_CSV)
        .then(text => write_to_file(text, file));
};

/**
 * 
 * @param {string} content, thing to write
 * @param {string} file, outfile
 * 
 * Not rocket science, writes if it can, errors otherwise
 */
const write_to_file = (content, file) => {
    fs.writeFile(file, content, err => {
        if (err) {
            console.error(err)
            return
        }
    })
};

/**
 * 
 * @param {string} place, city
 * @returns name based on city and state (if provided) 
 */
const file_name_from_city = (place) => {
    const [city, state] = place.split(', ');
    return  "./output/" + 
            (state ? state + "_" : "") + 
            city.toLowerCase()
               .replace(/ /g,"_")
               .replace(/\W/g, '') +
            ".json";
};

const places = [
    "Goldmine Saloon",
];
const city = "New Orleans, LA";
//const file = "./output/new_orleans.json"

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