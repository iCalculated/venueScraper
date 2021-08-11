'use strict';

const yelp = require('yelp-fusion');
const fs = require('fs');
const status = require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
var { tzOffsetAt, init: tzInit } = require('tzwhere');
tzInit();

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

const csv_format = ({name, location, categories, hours, image_url, coordinates, price, phone, photos})=> {
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

const format = ({name, location, categories, hours, coordinates, price, phone, photos, id})=> {
    const tags = categories.map(tag => tag.alias);
    const type_set = new Set(["TODO"]);
    tags.forEach(tag => {
        ["bar","club","lounge","restaurant","garden"]
            .filter(type => tag.includes(type))
            .forEach(type => {
                type_set.add(type[0].toUpperCase() + type.slice(1));
            })
    });
    const venue_type = [...type_set];

    const formatted_hours = Array(7).fill("null");
    if (hours) {
        hours
            .filter(hours => hours.hours_type == 'REGULAR')[0]
            .open
            .forEach(day_schedule => {
                formatted_hours[day_schedule.day] = { 
                    open: day_schedule.start.slice(0,2) + ":" + day_schedule.start.slice(2), 
                    close: day_schedule.end.slice(0,2) + ":" + day_schedule.end.slice(2), 
                };
            });

        // match day indexing
        formatted_hours.unshift(
            formatted_hours.pop()
        );
    }

    const gmt_offset = tzOffsetAt(coordinates.latitude, coordinates.longitude) / 3600000;

    return {
        _id: uuidv4(),
        venue_family: null,
        on_slide: false,
        name,
        address: location.address1 + ",\n" + location.city + ", " + location.state + " " + location.zip_code,
        description: "TODO",
        venue_type,
        // this is (probably) in the business' timezone
        hours: formatted_hours,
        image_links: photos,
        location: {
            type: "Point",
            coordinates: [coordinates.longitude, coordinates.latitude],
        },
        market: location.city + ", " + location.state,
        gmt_offset,
        metadata: {
            yelp_id: id,
            price,
            phone,
            tags,
        }
    };
};

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

const write_to_file = (content, file) => {
    fs.writeFile(file, content, err => {
        if (err) {
        console.error(err)
        return
        }
    })
};

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

search_list(places, city)
    .then(results => results.map(format))
    .then(JSON.stringify)
    .then(text => write_to_file(text, './test.json'));
//scrape_to_CSV(places, city, './export.csv')