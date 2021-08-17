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
rrrr
    --names: indicate that the input will be venue names (rather than yelp ids)
    --city: city of venues, required if `names`
    --format: [venue json (default), csv, hours], output format
    --outfile: file to write to (default: generates from city or output.json)
    names || ids
```

### Examples:

```
rrrr infile
```

Given an `infile` of `yelp-id`s, will return JSON output matching the `Venue` schema.

```
rrrr --names --city "New Orleans, LA" --format hours infile
```

Given an `infile` of venue names in New Orleans, will return JSON output providing only `yelp-id` identifier and opening hours.

### Yelp API

The Yelp API imposes some [limitations on usage](https://www.yelp.com/developers/documentation/v3/rate_limiting). The scraper performs requests sequentially to avoid triggering the [QPS limit](https://www.yelp.com/developers/documentation/v3/qps_rate_limiting) and will likely not be impacted by the 5000 requests/day limit assuming moderate use.

## TODO

- [X] Create CLI tools
- [X] Accept venue and function selection as command-line arguments
- [ ] Refactor CLI args
- [ ] CLI help
- [ ] Input ids from file