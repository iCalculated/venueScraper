'use strict';

const yelp = require('yelp-fusion');
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
        .then(result => result.jsonBody)
        .then(({name, location, coordinates, categories, image_url, photos, url, phone, display_phone, rating, hours, price})=> {
            return {
                name,
                address: location.address1 + ",\n" + location.city + ", " + location.state + " " + location.zip_code,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                tags: categories,
                hours,
                image_link: image_url,
            };
        });
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
    .then(
        console.log
    );