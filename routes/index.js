
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.opt = function(req, res){
    console.log(req.body)
    res.render('index', { title: 'Express' });
};