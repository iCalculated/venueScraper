'use strict';

const yelp = require('yelp-fusion');
const result = require('dotenv').config()

if (result.error) {
    throw result.error
}

const client = yelp.client(process.env.YELP_API_KEY)

client.search({
  term: 'McDonalds',
  location: 'st paul, MN',
  limit: 1,
}).then(response => {
  const id = response.jsonBody.businesses[0].id;
  client.business(id).then( response => {
      console.log({response});
  })
});