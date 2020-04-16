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
            [{'id': species},
             {'long_name': species}]
        },
        {'_id':0,'conversion':0,'common_name':0}
        ).exec(callback);
}

module.exports.getSpeciesDetailById = (id, callback) => {
    Species.find(
        {'id':id
        },
        {'_id':0,'conversion':0,'common_name':0}
        ).exec(callback);
}

module.exports.getSpeciesList = (callback) => {
    Species.find({},{'_id':0,'conversion':0,'common_name':0}).exec(callback);
}