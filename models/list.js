//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const GenelistSchema = mongoose.Schema({
    ptn: String,
    name: String,
    species: String,
    sequence: String,
    event: String,
    proxy_genes: [{
        proxy_org_short: String,
        proxy_org_long: String,
        proxy_gene: String,
    }],
});

const GeneList = module.exports = mongoose.model('genelists', GenelistSchema );
//const ShortGeneList = module.exports = mongoose.model('gene_one_proxy_list', ShortGenelistSchema );

//GeneList.find() returns all the lists
module.exports.getAllLists = (callback) => {
    GeneList.find(callback).limit(20);
}

module.exports.getSpecies = (callback) => {
    GeneList.find().distinct('species').exec(callback);
}

module.exports.getTotalGeneCountBySpecies = (species, callback) => {
    GeneList.find({'species': species}).count({}).exec(callback);
}
module.exports.getListsBySpecies = (species, pageNo, size, callback) => {
    GeneList.find({'species': species},{'_id':0,'species':0}).skip(size*(pageNo-1)).limit(size).exec(callback);
}


module.exports.getGeneByPtn = (ptn, callback) => {
    GeneList.find({'ptn': ptn}).exec(callback);
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