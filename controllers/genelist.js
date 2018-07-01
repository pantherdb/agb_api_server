//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const genelist = require('../models/list');
const shortlist = require('../models/short_list');
//const species = require('../models/species');

//GET HTTP method to /genelist
router.get('/',(req,res) => {
    shortlist.getAllLists((err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();

    }
    });
});

router.get('/species',(req,res) => {
    species.getAllSpecies((err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();

    }
    });
});

router.get('/species/:species',(req,res) => {
    var species = req.params.species;
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    shortlist.getTotalGeneCountBySpecies(species, (err, totalCount)=> {
        if(err) {
            res.json({success:false, message: `Failed to get total gene counts. Error: ${err}`});
        }
        else {
            shortlist.getListsBySpecies(species, pageNo, size, (err, lists)=> {
                 if(err) {
                      res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
                 }
                 else {
                    //var totalPages = Math.ceil(totalCount / size);
                    res.write(JSON.stringify({success: true, count: totalCount, lists:lists},null,2));
                    res.end();
                }
            })
        }
        })
    });

router.get('/proxygenes/:species/:exspecies',(req,res) => {
    var spe = req.params.species;
    var exspe = req.params.exspecies;
    //var size = parseInt(req.query.size);
    
    genelist.getListsByAncExtSpe(spe, exspe, (err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            console.log(spe);
            console.log(exspe);
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();

    }
    });
});

/* router.get('/species/:species',(req,res) => {
    var species = req.params.species;
    var pageNo = parseInt(req.query.pageNo);
    //var pageNo = 1;
    var size = parseInt(req.query.size);
    //var size = 100;
    genelist.getListsBySpecies(species, pageNo, size, (err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            //var totalPages = Math.ceil(totalCount / size);
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();
        }
    })
}); */

router.get('/gene/:ptn',(req,res) => {
    var ptn = req.params.ptn;
    genelist.getGeneByPtn(ptn, (err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();

    }
    });
});

/* router.get('/genes',(req,res) => {
    //var ptn = req.params.ptn;
    genelist.getAllgenes((err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();

    }
    });
}); */

//POST HTTP method to /genelist

router.post('/', (req,res,next) => {
    console.log(req.body);
    var newList = new genelist({
        ptn: req.body.ptn,
        name: req.body.name,
        species: req.body.species,
        sequence: req.body.sequence
    });
    genelist.addList(newList,(err) => {
        if(err) {
            res.json({success: false, message: `Failed to create a new list. Error: ${err}`});

        }
        else
            res.json({success:true, message: "Added successfully."});

    });
});

//DELETE HTTP method to /genelist. Here, we pass in a params which is the object id.
router.delete('/:id', (req,res,next)=> {
    //access the parameter which is the id of the item to be deleted
      var id = req.params.id;
    //Call the model method deleteListById
      list.deleteListById(id,(err,list) => {
          if(err) {
              res.json({success:false, message: `Failed to delete the list. Error: ${err}`});
          }
          else if(list) {
              res.json({success:true, message: "Deleted successfully"});
          }
          else
              res.json({success:false});
      })
  });
  module.exports = router;
