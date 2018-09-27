//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const genelist = require('../models/list');
const shortlist = require('../models/short_list');
const genelist_flat = require('../models/list_flat');
const Species = require('../models/species');

const request = require('request');
const cheerio = require('cheerio');

const apicache = require('apicache');

let cache = apicache.middleware;



//GET HTTP method to /genelist
router.get('/', (req, res) => {
    genelist.getAllLists((err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load all lists. Error: ${err}` });
        }
        else {
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();

        }
    });
});

/* router.get('/species',(req,res) => {
    species.getAllSpecies((err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();

    }
    });
}); */

router.get('/species/:species', (req, res) => {
    var species = req.params.species;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    shortlist.getTotalGeneCountBySpecies(species, (err, totalCount) => {
        if (err) {
            res.json({ success: false, message: `Failed to get total gene counts. Error: ${err}` });
        }
        else {
            shortlist.getListsBySpecies(species, page, limit, (err, lists) => {
                if (err) {
                    res.json({ success: false, message: `Failed to load all lists. Error: ${err}` });
                }
                else {
                    //var totalPages = Math.ceil(totalCount / size);
                    res.write(JSON.stringify({ success: true, total: totalCount, lists: lists }, null, 2));
                    res.end();
                }
            })
        }
    })
});

router.get('/species/:species/:proxy_spe', cache('2 hours'), (req, res) => {
    var species = req.params.species;
    var proxy_spe = req.params.proxy_spe;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    shortlist.getTotalGeneCountBySpecies(species, (err, totalCount) => {
        if (err) {
            res.json({ success: false, message: `Failed to get total gene counts. Error: ${err}` });
        }
        else {
            if (proxy_spe == 'default species') {
                shortlist.getListsBySpecies(species, page, limit, (err, lists) => {
                    if (err) {
                        res.json({ success: false, message: `Failed to load all lists. Error: ${err}` });
                    }
                    else {
                        //var totalPages = Math.ceil(totalCount / size);
                        res.write(JSON.stringify({ success: true, total: totalCount, lists: lists }, null, 2));
                        res.end();
                    }
                })
            } else {
                genelist_flat.getListByProxySpecies(species, proxy_spe, page, limit, (err, lists) => {
                    if (err) {
                        res.json({ success: false, message: `Failed to load all lists. Error: ${err}` });
                    }
                    else {
                        //var totalPages = Math.ceil(totalCount / size);
                        res.write(JSON.stringify({ success: true, total: totalCount, lists: lists }, null, 2));
                        res.end();
                    }
                })
            }

        }
    })
});

router.get('/proxy_species/:species', (req, res) => {
    var species = req.params.species;
    genelist_flat.getProxySpecies(species, (err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load all lists. Error: ${err}` });
        }
        else {
            //var totalPages = Math.ceil(totalCount / size);
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();
        }
    })
});




router.get('/species-info/:species', (req, res) => {
    var species = req.params.species;
    Species.getSpeciesDetail(species, (err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load species info. Error: ${err}` });
        }
        else {
            //var totalPages = Math.ceil(totalCount / size);
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();
        }
    })
});

router.get('/species-list', (req, res) => {
    Species.getSpeciesList((err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load species list. Error: ${err}` });
        }
        else {
            //var totalPages = Math.ceil(totalCount / size);
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();
        }
    })
});

router.get('/gene/:ptn', cache('1 day'), (req, res) => {
    var ptn = req.params.ptn;
    genelist.getGeneByPtn(ptn, (err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load all lists. Error: ${err}` });
        }
        else {

            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();


        }
    });
});

router.get('/gene_go/:ptn', cache('15 days'), (req, res) => {
    var ptn = req.params.ptn;
    var pantree_url = `http://pantree.org/node/annotationNode.jsp?id=${ptn}`;

    var dir_annos = [];
    var inh_annos = [];
    var annos = [];
    request(pantree_url, function (error, response, html) {
        if (!error) {
            if (html.indexOf('Unable to retrieve family information at this time for null') == -1) {
                var section = html.split('Direct Annotations to this node')[1];
                //console.log(section);
                var direct_annot_sec = section.split('Annotations inherited by this node')[0];
                var sec2 = section.split('Annotations inherited by this node')[1];
                var inherited_annot_sec = sec2.split('>Sequence<')[0];
                var direct_annot_lines = direct_annot_sec.split('\n');
                for (var i = 0; i < direct_annot_lines.length; i++) {
                    var regex = /http\:\/\/amigo\.geneontology\.org\/cgi\-bin\/amigo\/term\_details\?term\=(GO\%3A\d+)\"\>(.+)\<\/a\>/;
                    var found = direct_annot_lines[i].match(regex);
                    if (found) {
                        //console.log(found);
                        var go_acc = found[1].replace(/\%3A/, ':');
                        var go_name = found[2];
                        if (go_name.indexOf('(NOT)') == -1) {
                            dir_annos.push({ 'go_accession': go_acc, 'go_name': go_name });
                        }
                    }
                }
                //console.log(dir_annos);

                var inh_annot_lines = inherited_annot_sec.split('\n');
                for (var i = 0; i < inh_annot_lines.length; i++) {
                    var regex = /http\:\/\/amigo\.geneontology\.org\/cgi\-bin\/amigo\/term\_details\?term\=(GO\%3A\d+)\"\>(.+)\<\/a\>/;
                    var found = inh_annot_lines[i].match(regex);
                    if (found) {
                        //console.log(found);
                        var go_acc = found[1].replace(/\%3A/, ':');
                        var go_name = found[2];
                        if (go_name.indexOf('(NOT)') == -1) {
                            inh_annos.push({ 'go_accession': go_acc, 'go_name': go_name });
                        }
                    }
                }
            }
            //console.log(inh_annos);
            //lists[0].direct_paint_annotations = dir_annos;
            //lists[0].inherited_paint_annotations = inh_annos;
            annos = dir_annos.concat(inh_annos);
            //console.log(annos);
            res.write(JSON.stringify({ success: true, lists: [{ paint_annotations: annos }] }, null, 2));
            res.end();
        } else {
            res.json({ success: false, message: `Failed to load paint annotations. Error: ${error}` });
        }
    })
});

//router.get('/gene-pass/:anspecies/:exspecies', cache('2 hours'), (req, res) => {
router.get('/gene-pass/:anspecies/:exspecies', (req, res) => {
    var exspecies = req.params.exspecies;
    var anspecies = req.params.anspecies;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    genelist_flat.getPassedGenes(anspecies, exspecies, page, limit, (err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load all extant lists. Error: ${err}` });
        }
        else {
            //var totalPages = Math.ceil(totalCount / size);
            //console.log(lists);
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();
        }
    });
});

//router.get('/gene-loss/:anspecies/:exspecies', cache('2 hours'), (req, res) => {
router.get('/gene-loss/:anspecies/:exspecies', (req, res) => {
    var exspecies = req.params.exspecies;
    var anspecies = req.params.anspecies;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    genelist_flat.getLostGenes(anspecies, exspecies, page, limit, (err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load all extant lists. Error: ${err}` });
        }
        else {
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();
        }
    });
});

//router.get('/gene-gain/:anspecies/:exspecies', cache('2 hours'), (req, res) => {
router.get('/gene-gain/:anspecies/:exspecies', (req, res) => {
    var exspecies = req.params.exspecies;
    var anspecies = req.params.anspecies;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    genelist_flat.getGainedGenes(anspecies, exspecies, page, limit, (err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load all lists. Error: ${err}` });
        }
        else {
            //var totalPages = Math.ceil(totalCount / size);
            //console.log(lists);
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();
        }
    });
});

//router.get('/gene-no-model/:exspecies', cache('2 hours'), (req, res) => {
router.get('/gene-no-model/:exspecies', (req, res) => {
    var exspecies = req.params.exspecies;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    genelist_flat.getNotModeledGenes(exspecies, page, limit, (err, lists) => {
        if (err) {
            res.json({ success: false, message: `Failed to load all extant lists. Error: ${err}` });
        }
        else {
            res.write(JSON.stringify({ success: true, lists: lists }, null, 2));
            res.end();
        }
    });
});

module.exports = router;
