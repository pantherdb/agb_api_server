const mongoose = require('mongoose');
const GeneHistorySchema = mongoose.Schema({
    event : String,
	parent_species : String,
	child_species : String,
});

const GeneHistorySumSchema = mongoose.Schema({
        event : String,
            species_short : String,
            species_long : String,
            gene_number: Number
    });

const GeneHistory = module.exports = mongoose.model('gene_history_name', GeneHistorySchema, 'gene_history_name' );
const GeneHistorySum = module.exports = mongoose.model('gene_history_summary', GeneHistorySumSchema, 'gene_history_summary' );

module.exports.getGeneHistorySum = (chspecies, callback) => {
	GeneHistorySum.find(
                {$or: [{'species_short': chspecies}, {'species_long': chspecies}]},
                {'_id':0}
                        
        ).exec(callback);
	//console.log(parspecies);
	//GenomeCompare.find().exec(callback);
}

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

module.exports.getDirectInheritedGeneCount = (parspecies, chspecies,callback) => {
	GeneHistory.find(
        {$and:[
        {$or: [{'parent_species_short': parspecies}, {'parent_species_long': parspecies}]},
        {$or: [{'child_species_short': chspecies}, {'child_species_long': chspecies}]},
        {$or: [{'event':'AncestralGene-DirectInheritanceFromOneGene'},
         {'event':'ExtantGene-DirectInheritanceFromOneGene'}]}
        ]}
        
        ).count({}).exec(callback);
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

module.exports.getDuplicatedChildGeneCount = (parspecies, chspecies, callback) => {
	GeneHistory.find(
        {$and:[
        {$or: [{'parent_species_short': parspecies}, {'parent_species_long': parspecies}]},
        {$or: [{'child_species_short': chspecies}, {'child_species_long': chspecies}]},
        {$or: [{'event':'AncestralGene-InheritanceByDuplication'},
         {'event':'ExtantGene-InheritanceByDuplication'}]}
        ]}
        ).distinct('child_gene_ptn', callback);
}

module.exports.getDuplicatedParentGeneCount = (parspecies, chspecies, callback) => {
	GeneHistory.find(
        {$and:[
        {$or: [{'parent_species_short': parspecies}, {'parent_species_long': parspecies}]},
        {$or: [{'child_species_short': chspecies}, {'child_species_long': chspecies}]},
        {$or: [{'event':'AncestralGene-InheritanceByDuplication'},
         {'event':'ExtantGene-InheritanceByDuplication'}]}
        ]}
        ).distinct('parent_gene_ptn', callback);
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

module.exports.getDeNovoGeneCount = (species, callback) => {
	GeneHistory.find(
        {$and:[
        
        {$or: [{'child_species_short': species}, {'child_species_long': species}]},
        {'event':/DeNovoGain/}
        
        ]}
        
        ).count({}).exec(callback);
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

module.exports.getHorizTransGeneCount = (species, callback) => {
	GeneHistory.find(
        {$and:[
        
        {$or: [{'child_species_short': species}, {'child_species_long': species}]},
        {'event':/GainByHorizTrans/}
        
        ]}
        ).count({}).exec(callback);
}

module.exports.getLossGenes = (species, page, limit, callback) => {
	GeneHistory.find(
        {$and:[
        
        {$or: [{'child_species_short': species}, {'child_species_long': species}]},
        {'event':/Loss/}
        
        ]},

        {'_id':0,"child_gene_ptn":0}
        
        ).skip(limit*(page-1)).limit(limit).exec(callback);
}

module.exports.getLossGeneCount = (species, callback) => {
	GeneHistory.find(
        {$and:[
        
        {$or: [{'child_species_short': species}, {'child_species_long': species}]},
        {'event':/Loss/}
        
        ]}
        ).count({}).exec(callback);
}