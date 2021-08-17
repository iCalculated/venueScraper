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
    --input: [id (default), name], venue input format
    --format: [json (default), csv, hours], output format
    --city: city of venues, required if input=name
    --outfile: file to write to (default: generates from city or output.json)
    names || ids
```

Example:

```
rrrr --city "New Orleans, LA" --format=hours "JF-z1ORPdnduyfQ0Vy0zuQ" "0eP5RJNSsSYdPvUY3ZbTvw"                        
```

Gets the hours for the Gold Mine Saloon and the Cat's Meow. Note that the `city` flag is optional and is only used to generate the outfile name. Could be replaced with `--outfile output/LA_new_orleans.json`.

The Yelp API imposes some [limitations on usage](https://www.yelp.com/developers/documentation/v3/rate_limiting). The scraper performs requests sequentially to avoid triggering the [QPS limit](https://www.yelp.com/developers/documentation/v3/qps_rate_limiting) and will likely not be impacted by the 5000 requests/day limit assuming moderate use.

## TODO

- [X] Create CLI tools
- [X] Accept venue and function selection as command-line arguments
- [ ] Refactor CLI args
- [ ] CLI help