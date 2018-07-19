//Require mongoose package
const mongoose = require('mongoose');

//Define SpeciesSchema

const SpeciesSchema = mongoose.Schema({
    short_name: String,
    taxon_id: String,
    long_name: String,
    name: String,
    common_name: String,
    conversion: String
});

const Species = module.exports = mongoose.model('species', SpeciesSchema );

//GeneList.find() returns all the lists
module.exports.getSpeciesbyShort = (species, callback) => {
    Species.find({'short_name': species}).exec(callback);
}