//Require mongoose package
const mongoose = require('mongoose');

//Define SpeciesSchema

const SpeciesSchema = mongoose.Schema({
    short_name: String,
    taxon_id: String,
    long_name: String,
    name: String,
    common_name: String,
    conversion: String,
    timescale: String,
    gene_count: String,
    parent: String
});

const Species = module.exports = mongoose.model('species', SpeciesSchema );

module.exports.getSpeciesDetail = (species, callback) => {
    Species.find(
        {$or:
            [{'short_name': species},
             {'long_name': species}]
        }
        ).exec(callback);
}

module.exports.getSpeciesList = (callback) => {
    Species.find({},{'_id':0,'conversion':0,'common_name':0}).exec(callback);
}