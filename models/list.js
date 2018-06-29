//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const GenelistSchema = mongoose.Schema({
    node: String,
    ptn: String,
    name: String,
    species: String,
    sequence: String,
    type: String
});
const GeneList = module.exports = mongoose.model('GeneList', GenelistSchema );

//GeneList.find() returns all the lists
module.exports.getAllLists = (callback) => {
    GeneList.find(callback);
}

module.exports.getSpecies = (callback) => {
    GeneList.find().distinct('species').exec(callback);
}

module.exports.getListsBySpecies = (species, callback) => {
    GeneList.find({'species': species}).limit(1000).exec(callback);
}

module.exports.getGeneByPtn = (ptn, callback) => {
    GeneList.find({'ptn': ptn}).exec(callback);
}

//newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    newList.save(callback);
}

//Here we need to pass an id parameter to geneList.remove
module.exports.deleteListById = (id, callback) => {
    var query = {_id: id};
    GeneList.remove(query, callback);
}