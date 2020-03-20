const mongoose = require('mongoose');
const GeneHistorySchema = mongoose.Schema({
    event : String,
	parent_species : String,
	child_species : String,
});

const GeneHistory = module.exports = mongoose.model('gene_history', GeneHistorySchema, 'gene_history' );

module.exports.getAllHistory = (callback) => {
	GeneHistory.find().exec(callback);
	//console.log(parspecies);
	//GenomeCompare.find().exec(callback);
}