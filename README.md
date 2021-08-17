# Venue Info Scraper

The name is pretty self-explanatory, leverages the `yelp-fusion` API to get information on given venues.

## Installation

```shell
git clone https://github.com/iCalculated/venueScraper.git
cd venueScraper
npm install
```

Create a `.env` file in the directory with

```
YELP_API_KEY=<key>
```

To get a key, follow the steps [here](https://www.yelp.com/developers/documentation/v3/authentication).

## Usage

```shell
node scraper.js
```

Currently, configuration is done by putting venue names in the `places` array, setting `city` to the intended city, and an outfile (`JSON`) is indicated by file. Those should become arguments or something shortly.

The Yelp API imposes some [limitations on usage](https://www.yelp.com/developers/documentation/v3/rate_limiting). The scraper performs requests sequentially to avoid triggering the [QPS limit](https://www.yelp.com/developers/documentation/v3/qps_rate_limiting) and will likely not be impacted by the 5000 requests/day limit assuming moderate use.

## TODO

- Create CLI tools
- Accept venue and function selection as command-line arguments