//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const GenelistFlatSchema = mongoose.Schema({
    ptn: String,
    name: String,
    species: String,
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
    GeneListFlat.find().distinct('species').exec(callback);
}

module.exports.getProxySpecies = (species, callback) => {
    GeneListFlat.find({'species': species}).distinct('proxy_org_long').exec(callback);
}

module.exports.getListByProxySpecies = (species, proxy_spe, pageNo, size, callback) => {
    GeneListFlat.find({$or: [{'species': species, 'proxy_org_long': proxy_spe}, {'species': species, 'proxy_org_short': proxy_spe}]},{'_id':0,'event':0,'sequence':0,'proxy_org_short':0,'proxy_org_long':0,'family_name':0,'species':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}

module.exports.getTotalGeneCountBySpecies = (species, callback) => {
    GeneListFlat.find({'species': species}).count({}).exec(callback);
}
module.exports.getListsBySpecies = (species, pageNo, size, callback) => {
    GeneListFlat.find({'species': species},{'_id':0,'species':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}


module.exports.getGeneByPtn = (ptn, callback) => {
    GeneListFlat.find({'ptn': ptn}, {'proxy_gene':1}).exec(callback);
}

//newList.save is used to insert the document into MongoDB
/* module.exports.addList = (newList, callback) => {
    newList.save(callback);
}

//Here we need to pass an id parameter to geneList.remove
module.exports.deleteListById = (id, callback) => {
    var query = {_id: id};
    GeneList.remove(query, callback);
} */