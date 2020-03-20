//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const GenomeCompareSchema = mongoose.Schema({
    event : String,
	pthr : String,
	parent_species_short : String,
	parent_species_long : String,
	child_species_short : String,
	child_species_long : String,
	event_ptn: String,
	parent_gene_ptn: String,
	child_gene_ptn: String,
});

const GenomeCompare = module.exports = mongoose.model('genomeComparison', GenomeCompareSchema );



module.exports.getDirectInheritedGenes = (parspecies, page, limit, callback) => {
	//GenomeCompare.find({$or: [{'parent_species_short': parspecies}, {'parent_species_long': parspecies}]}).skip(limit*(page-1)).limit(limit).exec(callback);
	//console.log(parspecies);
	GenomeCompare.find().exec(callback);
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