'use strict';

const yelp = require('yelp-fusion');
const fs = require('fs');
const status = require('dotenv').config()

if (status.error) {
    throw result.error
}

const search = async (name, city) => {
    const response = await client.search({
        term: name,
        location: city, 
        limit: 1,
    });
    const id = response.jsonBody.businesses[0].id;
    const search_result = await client.business(id)
        .then(result => result.jsonBody);
    return search_result
};

const search_list = async (places, city) => {
    const results = [];
    for (const place of places) {
        results.push(
            await search(place, city)
        );
    }
    return results;
}

const csvFormat = ({name, location, categories, hours, image_url, coordinates, price, phone, photos})=> {
    const formatted_hours = Array(7).fill("null");

    if(hours) {
        hours
            .filter(hours => hours.hours_type == 'REGULAR')[0]
            .open
            .forEach(day_schedule => {
                formatted_hours[day_schedule.day] = day_schedule.start
                    ? `{open: "` + day_schedule.start + `", close: "` + day_schedule.end +`"}` 
                    : `null`
            });
    }

    return {
        name,
        address: location.address1 + ",\n" + location.city + ", " + location.state + " " + location.zip_code,
        description: null,
        types: null,
        tags: categories.map(tag => tag.alias).join(","),
        sunday: formatted_hours[6],
        monday: formatted_hours[0],
        tuesday: formatted_hours[1],
        wednesday: formatted_hours[2],
        thursday: formatted_hours[3],
        friday: formatted_hours[4],
        saturday: formatted_hours[5],
        image_link: image_url,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        price,
        phone,
        photos: photos.join(","),
        //extendedProps
    };
};

const format = ({name, location, categories, hours, image_url, coordinates, price, phone, photos, ...extendedProps})=> {
    const formatted_hours = Array(7).fill("null");

    if (hours) {
        hours
            .filter(hours => hours.hours_type == 'REGULAR')[0]
            .open
            .forEach(day_schedule => {
                formatted_hours[day_schedule.day] = { 
                    open: day_schedule.start, 
                    close: day_schedule.end
                };
            });

        // match day indexing
        formatted_hours.unshift(
            formatted_hours.pop()
        );
    }

    return {
        name,
        address: location.address1 + ",\n" + location.city + ", " + location.state + " " + location.zip_code,
        tags: categories.map(tag => tag.alias).join(","),
        hours: formatted_hours,
        image_link: image_url,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        price,
        phone,
        photos: photos.join(","),
        extendedProps
    };
};

const convertToCSV = objectArray => {
    const array = [Object.keys(objectArray[0])].concat(objectArray)
    return array.map(row => {
        return Object.values(row).map(value => {
            return typeof value === 'string' ? JSON.stringify(value) : value
        }).toString()
    }).join('\n')
}

const scrape_to_CSV = (places, city, file) => {
    search_list(places, city)
        .then(results => results.map(csvFormat))
        .then(convertToCSV)
        .then(csv => {
            fs.writeFile(file, csv, err => {
                if (err) {
                console.error(err)
                return
                }
            })
        });
}

const client = yelp.client(process.env.YELP_API_KEY)

const places = [
    "Antones Nightclub",
    "Summit Rooftop Lounge",
    "Barbarella ",
    "Highland Lounge",
    "Elephant Room",
    "Flamingo Cantina",
    "Whislers",
    "The Roosevelt Room",
    "Ego's Lounge",
    "Dirty Bill's ",
    "Hotel Vegas/Volstead Lounge",
];
const city = "Austin, TX";


scrape_to_CSV(places, city, './export.csv')