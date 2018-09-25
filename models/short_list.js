//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const ShortGenelistSchema = mongoose.Schema({
    ptn: String,
    species:String,
    species_long:String,
    name: String,
    pthr: String,
    ancestor_species: String,
    proxy_gene: String,
});
//const GeneList = module.exports = mongoose.model('genelists', GenelistSchema );
const ShortGeneList = module.exports = mongoose.model('gene_one_proxy_lists', ShortGenelistSchema );

module.exports.getTotalGeneCountBySpecies = (species, callback) => {
    ShortGeneList.find({$or: [{'species': species}, {'species_long': species}]}).count({}).exec(callback);
}
module.exports.getListsBySpecies = (species, page, limit, callback) => {
    ShortGeneList.find({$or: [{'species': species}, {'species_long': species}]},{'_id':0,'species':0}).skip(limit*(page-1)).limit(limit).exec(callback);
}
module.exports.getGeneGains = (exspecies, anspecies,page, limit, callback) => {
    ShortGeneList.find({$or: [{'species': exspecies}, {'species_long': exspecies}]},{'_id':0,'species':0}).find({'ancestor_species': {'$regex' : '^((?!anspecies).)*$', '$options' : 'i'}}).skip(limit*(page-1)).limit(limit).exec(callback);
}

module.exports.getGeneGainsNum = (exspecies, anspecies, callback) => {
    ShortGeneList.find({$or: [{'species': exspecies}, {'species_long': exspecies}]}).find({'ancestor_species': {'$regex' : '^((?!anspecies).)*$', '$options' : 'i'}}).count({}).exec(callback);
}