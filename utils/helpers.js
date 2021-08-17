
/**
 * 
 * @param {string} place, city
 * @returns name based on city and state (if provided) 
 */
exports.file_name_from_city = (place) => {
    const [city, state] = place.split(', ');
    return  "./output/" + 
            (state ? state + "_" : "") + 
            city.toLowerCase()
               .replace(/ /g,"_")
               .replace(/\W/g, '') +
            ".json";
};

/**
 * 
 * @param {Array<Object>} objectArray
 * @returns string in CSV format
 */
exports.convert_to_CSV = objectArray => {
    const array = [Object.keys(objectArray[0])].concat(objectArray)
    return array.map(row => {
        return Object.values(row).map(value => {
            return typeof value === 'string' ? JSON.stringify(value) : value
        }).toString()
    }).join('\n')
}

/**
 * 
 * @param {string} content, thing to write
 * @param {string} file, outfile
 * 
 * Not rocket science, writes if it can, errors otherwise
 */
exports.write_to_file = (content, file) => {
    fs.writeFile(file, content, err => {
        if (err) {
            console.error(err)
            return
        }
    })
};
