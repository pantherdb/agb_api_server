//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

/* const GenomeCompareSchema = mongoose.Schema({
    species_short : {type: String, required:false},
	species_long : {type: String, required:false},
	event : {type: String, required:false},
	pthr : {type: String, required:false},
	new_gene_ptn : {type: String, required:false},
	parent_species_short : {type: String, required:false},
	parent_species_long : {type: String, required:false},
	child_species_short : {type: String, required:false},
	child_species_long : {type: String, required:false},
	parent_gene_ptn : {type: String, required:false},
	child_loss_ptn : {type: String, required:false},
	child_gene_ptn : {type: String, required:false},
	duplication_ptn : {type: String, required:false},
	child_extant_species_short : {type: String, required:false},
	child_extant_species_long : {type: String, required:false},
	parent_ancestral_gene_ptn : {type: String, required:false},
	child_extant_gene_ptn : {type: String, required:false},
	donor_species_short : {type: String, required:false},
	donor_species_long : {type: String, required:false},
	donor_gene_ptn : {type: String, required:false},
	recipient_species_short : {type: String, required:false},
	recipient_species_long : {type: String, required:false},
	HorizTrans_ptn : {type: String, required:false},
	recipient_gene_ptn : {type: String, required:false},
	duplication_node_ptn : {type: String, required:false},
},{strict: false}); */
const GenomeCompareSchema = mongoose.Schema({ any: {} });

const GenomeCompare = module.exports = mongoose.model('genomeComparison', GenomeCompareSchema );



module.exports.getDirectInheritedGenes = (species, callback) => {
    GenomeCompare.findById(ObjectId("5e69cd912eccddaa4ddb6dea")).exec(callback);
    //GenomeCompare.find({'child_species_short': species, 'event': 'AncestralGene-DirectInheritanceFromOneGene'}).limit(20).exec(callback);
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