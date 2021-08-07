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
    const search_result = await client.business(id);
    return search_result.jsonBody;
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