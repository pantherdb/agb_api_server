//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const GenelistFlatSchema = mongoose.Schema({
    ptn: String,
    name: String,
    species_short: String,
    species_long: String,
    //sequence: String,
    event: String,
    descent_spe_short: String,
    descent_spe_long: String,
    proxy_gene: String,
    proxy_gene_ptn: String,
    proxy_gene_name: String,
    proxy_gene_symbol: String,
    descent_ptns: String,
    descnet_gnames: String,
    descent_longIds: String

});

const GeneListFlat = module.exports = mongoose.model('flat_genelists', GenelistFlatSchema );


module.exports.getSpecies = (callback) => {
    GeneListFlat.find().distinct('species_short').exec(callback);
}

module.exports.getProxySpecies = (species, callback) => {
    GeneListFlat.find({'species_short': species}).distinct('descent_spe_long').exec(callback);
}

module.exports.getListByProxySpecies = (species, proxy_spe, pageNo, size, callback) => {
    GeneListFlat.find({$or: [{'species_short': species, 'descent_spe_long': proxy_spe}, {'species_short': species, 'descent_spe_long': proxy_spe}]},
    {'_id':0,'event':0,'descent_spe_short':0,'descent_spe_long':0,'species_short':0, 'species_long':0, "descent_longIds":0, "descentant_ptns":0, 'descent_gnames':0, 'proxy_gene_ptn':0, 'proxy_gene_name':0, 'proxy_gene_symbol':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}

module.exports.getTotalGeneCountBySpecies = (species, callback) => {
    GeneListFlat.find({'species_short': species}).count({}).exec(callback);
}

module.exports.getPassedGeneNum = (aSpecies, eSpecies, pageNo, size, callback) => {

}

module.exports.getPassedGenes = (aSpecies, eSpecies, pageNo, size, callback) => {
    GeneListFlat.find(
        {$and:
            [
                {$or: [{'species_short': aSpecies, 'descent_spe_long': eSpecies}, {'species_short': aSpecies, 'descent_spe_short': eSpecies}]},
                {'desendant_ptns': {$not: /NOT_AVAILABLE/}}
            ] 
        },
        {'_id':0,'event':0,'descent_spe_short':0,'descent_spe_long':0, 'species_short':0, 'species_long':0, "proxy_gene":0, "proxy_gene_ptn":0, "proxy_gene_name":0,"proxy_gene_symbol":0, "descent_longIds":0, 'pthr':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}

module.exports.getLostGenes = (aSpecies, eSpecies, pageNo, size, callback) => {
    GeneListFlat.find(
        {$and:
            [
                {$or: [{'species_short': aSpecies, 'descent_spe_long': eSpecies}, {'species_short': aSpecies, 'descent_spe_short': eSpecies}]},
                {'desendant_ptns': /NOT_AVAILABLE/}
            ] 
        },
        {'_id':0,'event':0,'descent_spe_short':0,'descent_spe_long':0,'species_short':0, 'species_long':0, "proxy_gene":0, "desendant_ptns":0, 'descent_gnames':0, "descent_longIds":0,'pthr':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}

module.exports.getNotModeledGenes = (eSpecies, pageNo, size, callback) => {
    GeneListFlat.find(
        {$and:
            [
                {$or: [{'species_short': eSpecies}, {'species_long': eSpecies}]},
                {'pthr': /NOT_AVAILABLE/}
            ] 
        },
        {'_id':0,'event':0,'species_short':0, 'species_long':0, "proxy_gene":0, 'pthr':0, "desendant_ptns":0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}

