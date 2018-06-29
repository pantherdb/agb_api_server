//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const SpeciesSchema = mongoose.Schema({
    species: [String]
});

const SpeciesGenesSchema = mongoose.Schema({
    short_name: String,
    taxon_id: String,
    long_name: String,
    genes: [
        {
            ptn:String,
            name:String,
            event:String,
            pthr:String,
            proxy_org:String,
            proxy_gene:String

        }
    ]
});

const Species = module.exports = mongoose.model('Species', SpeciesSchema );

const SpeciesGenes = module.exports = mongoose.model('species_genes', SpeciesGenesSchema );

//GeneList.find() returns all the lists
module.exports.getAllSpecies = (callback) => {
    SpeciesGenes.find({}).select({ "short_name": 1, "long_name": 1, "taxon_id": 1, "_id": 0}).exec(callback);
}

module.exports.getAllGenesBySpecies = (species, callback) => {
    SpeciesGenes.find({'short_name': species}).limit(1000).exec(callback);
}