//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const ShortGenelistSchema = mongoose.Schema({
    ptn: String,
    species_short:String,
    species_long:String,
    name: String,
    pthr: String,
    ancestor_species: String,
    default_proxy_gene: String,
});

/* const GenelistFlatSchema = mongoose.Schema({
    ptn: String,
    name: String,
    species: String,
    sequence: String,
    event: String,
    proxy_org_short: String,
    proxy_org_long: String,
    proxy_gene: String
}); */

//const GeneList = module.exports = mongoose.model('genelists', GenelistSchema );
//const ShortGeneList = module.exports = mongoose.model('gene_one_proxy_lists', ShortGenelistSchema );
const ShortGeneList = module.exports = mongoose.model('short_genelists', ShortGenelistSchema );
//const GeneListFlat = module.exports = mongoose.model('flat_genelists', GenelistFlatSchema );

module.exports.getTotalGeneCountBySpecies = (species, callback) => {
    ShortGeneList.find({$or: [{'species_short': species}, {'species_long': species}]}).count({}).exec(callback);
}
module.exports.getListsBySpecies = (species, page, limit, callback) => {
    ShortGeneList.find({$or: [{'species_short': species}, {'species_long': species}]},{'_id':0,'species_short':0, 'species_long':0, 'ancestor_species':0}).skip(limit*(page-1)).limit(limit).exec(callback);
}
module.exports.getGainedGenes = (anspecies, exspecies, page, limit, callback) => {
    ShortGeneList.find(
        {$and:[
            {'ancestor_species': {$not: new RegExp(anspecies)}, 'pthr': {$not: /NOT_AVAILABLE/}},
            {$or: [{'species_short': exspecies}, {'species_long': exspecies}]}
        ]}, 
        //{'_id':0,'species':0, 'species_long':0, 'pthr':0, 'ancestor_species':0, 'proxy_gene':0}
        {'_id':0,'species_short':0, 'species_long':0, 'pthr':0, 'ancestor_species':0}
    ).skip(limit*(page-1)).limit(limit).exec(callback);
}

/* module.exports.getGeneGains = (anspecies, exspecies, page, limit, callback) => {
    ShortGeneList.find(
        {$and:[
            {'proxy_of_ancestor_spe': {$not: new RegExp(anspecies)}},
            {$or: [{'species': exspecies}, {'species_long': exspecies}]}
        ]}, 
        {'_id':0,'species':0}
    ).skip(limit*(page-1)).limit(limit).exec(callback);
} */