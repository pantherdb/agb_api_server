//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const GenelistFlatSchema = mongoose.Schema({
    ptn: String,
    name: String,
    species_short: String,
    species_long: String,
    sequence: String,
    event: String,
    proxy_org_short: String,
    proxy_org_long: String,
    proxy_gene: String,
    all_desendant_gene_ptn_in_proxy_species: String,
    all_desendant_gene_name_in_proxy_species: String,
    all_desendant_longId_in_proxy_species: String

});

const GeneListFlat = module.exports = mongoose.model('flat_genelists', GenelistFlatSchema );
//const ShortGeneList = module.exports = mongoose.model('gene_one_proxy_list', ShortGenelistSchema );

//GeneList.find() returns all the lists
module.exports.getAllLists = (callback) => {
    GeneListFlat.find(callback).limit(20);
}

module.exports.getSpecies = (callback) => {
    GeneListFlat.find().distinct('species_short').exec(callback);
}

module.exports.getProxySpecies = (species, callback) => {
    GeneListFlat.find({'species_short': species}).distinct('proxy_org_long').exec(callback);
}

module.exports.getListByProxySpecies = (species, proxy_spe, pageNo, size, callback) => {
    GeneListFlat.find({$or: [{'species_short': species, 'proxy_org_long': proxy_spe}, {'species_short': species, 'proxy_org_short': proxy_spe}]},{'_id':0,'event':0,'sequence':0,'proxy_org_short':0,'proxy_org_long':0,'family_name':0,'species':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}

module.exports.getTotalGeneCountBySpecies = (species, callback) => {
    GeneListFlat.find({'species_short': species}).count({}).exec(callback);
}
module.exports.getListsBySpecies = (species, pageNo, size, callback) => {
    GeneListFlat.find({'species_short': species},{'_id':0,'species':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}


module.exports.getGeneByPtn = (ptn, callback) => {
    GeneListFlat.find({'ptn': ptn}, {'proxy_gene':1}).exec(callback);
}

module.exports.getPassedGenes = (aSpecies, eSpecies, pageNo, size, callback) => {
    GeneListFlat.find(
        {$and:
            [
                {$or: [{'species_short': aSpecies, 'proxy_org_long': eSpecies}, {'species_short': aSpecies, 'proxy_org_short': eSpecies}]},
                {'all_desendant_gene_ptn_in_proxy_species': {$not: /NOT_AVAILABLE/}}
            ] 
        },
        {'_id':0,'event':0,'sequence':0,'proxy_org_short':0,'proxy_org_long':0,'family_name':0,'species_short':0, 'species_long':0, "proxy_gene":0, "proxy_gene_ptn":0, "proxy_gene_name":0,"proxy_gene_symbol":0, "all_desendant_longId_in_proxy_species":0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}

module.exports.getLostGenes = (aSpecies, eSpecies, pageNo, size, callback) => {
    GeneListFlat.find(
        {$and:
            [
                {$or: [{'species_short': aSpecies, 'proxy_org_long': eSpecies}, {'species_short': aSpecies, 'proxy_org_short': eSpecies}]},
                {'all_desendant_gene_ptn_in_proxy_species': /NOT_AVAILABLE/}
            ] 
        },
        {'_id':0,'event':0,'sequence':0,'proxy_org_short':0,'proxy_org_long':0,'family_name':0,'species_short':0, 'species_long':0, "proxy_gene":0, "all_desendant_gene_ptn_in_proxy_species":0, 'all_desendant_gene_name_in_proxy_species':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}

module.exports.getNotModeledGenes = (eSpecies, pageNo, size, callback) => {
    GeneListFlat.find(
        {$and:
            [
                {$or: [{'species_short': eSpecies}, {'species_long': eSpecies}]},
                {'pthr': /NOT_AVAILABLE/}
            ] 
        },
        {'_id':0,'event':0,'sequence':0, 'species_short':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}