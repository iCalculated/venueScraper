'use strict';

const yelp = require('yelp-fusion');
const status = require('dotenv').config()

if (status.error) {
    throw result.error
}

const client = yelp.client(process.env.YELP_API_KEY)

const search_term = {
    name: 'Flamingo Cantina',
    city: 'Austin, TX',
};

const search = async (search_term) => {
    const response = await client.search({
        term: search_term.name,
        location: search_term.city, 
        limit: 1,
    });
    const id = response.jsonBody.businesses[0].id;
    const search_result = await client.business(id);
    return search_result.jsonBody;
};

const search_result = search(search_term);
search_result.then(console.log);

