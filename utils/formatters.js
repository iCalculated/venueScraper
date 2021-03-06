const { v4: uuidv4 } = require('uuid');
var { tzOffsetAt, init: tzInit } = require('tzwhere');

// gymastics to silence tzInit's print statements.
const log = console.log;
{
console.log = () => {};
tzInit();
}
console.log = log;

/**
 * @param {venue} venue 
 * @returns CSV formatted venue
 * 
 * Destructures a venue then reformats it for CSV usage
 */
exports.format_csv = ({name, location, categories, hours, image_url, coordinates, price, phone, photos})=> {
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

/**
 * 
 * @param {venue} venue 
 * @returns JSON formatted venue
 * 
 * Destructures a venue then reformats it for JSON usage
 * retains only reelvant fields 
 */
exports.format = ({name, location, categories, hours, coordinates, price, phone, photos, id})=> {
    // convert tags to short forms rather than human-facing, e.g. "beergarden" vs "Beer Garden"
    const tags = categories.map(tag => tag.alias);
    const type_set = new Set();
    // hack to get venue type from tags
    tags.forEach(tag => {
        ["bar","club","lounge","restaurant","garden"]
            .filter(type => tag.includes(type))
            .forEach(type => {
                type_set.add(type[0].toUpperCase() + type.slice(1));
            })
    });
    // sugar to make a set into an array
    const venue_type = [...type_set];
    const formatted_hours = format_hours(hours);

    // offset in milliseconds to hours
    const gmt_offset = tzOffsetAt(coordinates.latitude, coordinates.longitude) / 3600000;

    return {
        _id: uuidv4(),
        venue_family: null,
        on_slide: false,
        name,
        address: location.address1 + ", " + location.city + ", " + location.state + " " + location.zip_code,
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
            // take only the last 10 digits of phone, as in schema
            phone: phone.replace(/[^\d]/g,"").slice(-10),
            tags,
        }
    };
};

exports.format_hours_update = ({hours, id}) => {
    return {
        hours: format_hours(hours),
        metadata: { yelp_id: id },
    }
};

const format_hours = (hours) => {
    const formatted_hours = Array(7).fill(null);
    if (hours) {
        // hours is an array of opening schedules (not days!)
        hours
            // check for regular schedule (no others exist yet)
            // and take first (should be only)
            .filter(hours => hours.hours_type == 'REGULAR')[0]
            // hours contains extraneous stuff like is_open, so just take schedule
            .open
            // format hours according to the Venue schema
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
    return formatted_hours;
};