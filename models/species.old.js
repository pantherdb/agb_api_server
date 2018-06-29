//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const SpeciesSchema = mongoose.Schema({
    species: [String]
});

const SpeciesGenesSchema = mongoose.Schema({
    species: String,
    genes: [
        {
            ptn:String,
            name:String
        }
    ]
});

const Species = module.exports = mongoose.model('Species', SpeciesSchema );

const SpeciesGenes = module.exports = mongoose.model('species_genes', SpeciesGenesSchema );

//GeneList.find() returns all the lists
module.exports.getAllSpecies = (callback) => {
    Species.find(callback);
}

module.exports.getAllGenesBySpecies = (species, callback) => {
    SpeciesGenes.find({'species': species}).exec(callback);
}