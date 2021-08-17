const yelp = require('yelp-fusion');
const status = require('dotenv').config()
// check for a .env error
if (status.error) {
    throw result.error
}

const client = yelp.client(process.env.YELP_API_KEY)

/**
 * 
 * @param {string} name, venue name,
 * @param {string} city, venue city, (long-lat can be used instead)
 * @returns JSON containing venue properties 
 */
exports.search = async (name, city) => {
    const response = await client.search({
        term: name,
        location: city,
        limit: 1,
    });
    if (response.jsonBody.businesses[0]) {
        const id = response.jsonBody.businesses[0].id;
        const search_result = await client.business(id)
            .then(result => result.jsonBody);
        return search_result
    }
    else {
        console.log(`${name} not found.`);
    }
};
