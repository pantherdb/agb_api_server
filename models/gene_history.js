const mongoose = require('mongoose');
const GeneHistorySchema = mongoose.Schema({
    event : String,
	parent_species : String,
	child_species : String,
});

const GeneHistory = module.exports = mongoose.model('gene_history', GeneHistorySchema, 'gene_history' );

module.exports.getAllEvent = (callback) => {
	GeneHistory.find().distinct('event').exec(callback);
	//console.log(parspecies);
	//GenomeCompare.find().exec(callback);
}

module.exports.getDirectInheritedGenes = (parspecies, chspecies, page, limit, callback) => {
	GeneHistory.find(
        {$and:[
        {$or: [{'parent_species_short': parspecies}, {'parent_species_long': parspecies}]},
        {$or: [{'child_species_short': chspecies}, {'child_species_long': chspecies}]},
        {$or: [{'event':'AncestralGene-DirectInheritanceFromOneGene'},
         {'event':'ExtantGene-DirectInheritanceFromOneGene'}
        ]}
        ]}
        /* {'parent_species_short': parspecies, 'child_species_short': chspecies, 'event':'AncestralGene-DirectInheritanceFromOneGene'} */
        
        ).skip(limit*(page-1)).limit(20).exec(callback);
	//console.log(parspecies);
	//GenomeCompare.find().exec(callback);
}