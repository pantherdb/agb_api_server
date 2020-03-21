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
         {'event':'ExtantGene-DirectInheritanceFromOneGene'}]}
        ]},

        {'_id':0,'event_ptn':0}
        
        ).skip(limit*(page-1)).limit(limit).exec(callback);
}

module.exports.getDuplicatedGenes = (parspecies, chspecies, page, limit, callback) => {
	GeneHistory.find(
        {$and:[
        {$or: [{'parent_species_short': parspecies}, {'parent_species_long': parspecies}]},
        {$or: [{'child_species_short': chspecies}, {'child_species_long': chspecies}]},
        {$or: [{'event':'AncestralGene-InheritanceByDuplication'},
         {'event':'ExtantGene-InheritanceByDuplication'}]}
        ]},

        {'_id':0}
        
        ).skip(limit*(page-1)).limit(limit).exec(callback);
}

module.exports.getDeNovoGenes = (species, page, limit, callback) => {
	GeneHistory.find(
        {$and:[
        
        {$or: [{'child_species_short': species}, {'child_species_long': species}]},
        {'event':/DeNovoGain/}
        
        ]},

        {'_id':0,"parent_species_short":0,"parent_species_long":0,"event_ptn":0,"parent_gene_ptn":0}
        
        ).skip(limit*(page-1)).limit(limit).exec(callback);
}

module.exports.getHorizTransGenes = (species, page, limit, callback) => {
	GeneHistory.find(
        {$and:[
        
        {$or: [{'child_species_short': species}, {'child_species_long': species}]},
        {'event':/GainByHorizTrans/}
        
        ]},

        {'_id':0}
        
        ).skip(limit*(page-1)).limit(limit).exec(callback);
}