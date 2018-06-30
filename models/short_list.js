//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const ShortGenelistSchema = mongoose.Schema({
    ptn: String,
    species:String,
    name: String,
    pthr: String,
    proxy_gene: String,
});
//const GeneList = module.exports = mongoose.model('genelists', GenelistSchema );
const ShortGeneList = module.exports = mongoose.model('gene_one_proxy_lists', ShortGenelistSchema );

module.exports.getTotalGeneCountBySpecies = (species, callback) => {
    ShortGeneList.find({'species': species}).count({}).exec(callback);
}
module.exports.getListsBySpecies = (species, pageNo, size, callback) => {
    ShortGeneList.find({'species': species}).skip(size*(pageNo-1)).limit(size).exec(callback);
}