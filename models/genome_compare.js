//Require mongoose package
const mongoose = require('mongoose');

//Define GenelistSchema

const GenomeCompareSchema = mongoose.Schema({
    species_short : String,
	species_long : String,
	event : String,
	pthr : String,
	new_gene_ptn : String,
	parent_species_short : String,
	parent_species_long : String,
	child_species_short : String,
	child_species_long : String,
	parent_gene_ptn : String,
	child_loss_ptn : String,
	child_gene_ptn : String,
	duplication_ptn : String,
	child_extant_species_short : String,
	child_extant_species_long : String,
	parent_ancestral_gene_ptn : String,
	child_extant_gene_ptn : String,
	donor_species_short : String,
	donor_species_long : String,
	donor_gene_ptn : String,
	recipient_species_short : String,
	recipient_species_long : String,
	HorizTrans_ptn : String,
	recipient_gene_ptn : String,
	duplication_node_ptn : String
});

const GenomeCompare = module.exports = mongoose.model('genomeCompare', GenomeCompareSchema );



module.exports.getDirectInheritedGenes = (parspecies, chilspecies, page, limit, callback) => {
    GenomeCompare.find(
        {$and:[
            {'parent_species_short': parspecies}, {'child_species_short': chilspecies}, {'event': 'AncestralGene-DirectInheritanceFromOneGene'}
        ]}, 
        //{'_id':0,'species':0, 'species_long':0, 'pthr':0, 'ancestor_species':0, 'proxy_gene':0}
        {'_id':0}
    ).skip(limit*(page-1)).limit(limit).exec(callback);
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