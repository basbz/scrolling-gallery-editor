/*global module:false*/
var fs = require('fs'),
    _ = require('lodash'),
    mkdirp = require('mkdirp'),
    formidable = require('formidable');

mkdirp.sync(__dirname + '/.staticDB');

var StaticDB = {
  id: function (tb) {
    var data, file = __dirname + '/.staticDB/__id.json';

    data = fs.existsSync(file)? JSON.parse(fs.readFileSync(file)) : {};
    data[tb] = data[tb] || 0;
    data[tb] += 1;

    fs.writeSync(fs.openSync(file, 'w'), JSON.stringify(data));
    return data[tb];
  },


  table: function (file, data) {
    if(arguments.length > 1)
      fs.writeSync(fs.openSync(file, 'w'), JSON.stringify(data));

    if(! fs.existsSync(file))
      return [];

    return JSON.parse(fs.readFileSync(file));
  }
};

StaticDB.modules = StaticDB.table.bind(null, __dirname + '/.staticDB/__modules.json');

var API = {
  modules: {
    get: function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(StaticDB.modules()));
    },

    post: function (req, res) {
      res.setHeader('Content-Type', 'application/json');

      var mod, modules = StaticDB.modules();
      mod = {id: StaticDB.id('modules')};
      modules.push(mod);
      StaticDB.modules(modules);

      res.end(JSON.stringify(mod));
    },

    put: function (req, res) {
      res.setHeader('Content-Type', 'application/json');

      new formidable.IncomingForm().parse(req, function(err, fields) {
        StaticDB.modules(StaticDB.modules().map(function (mod) {
          if(mod.id == req.params.id)
            mod.blob = fields;

          return mod;
        }));

        res.end(JSON.stringify(fields));
      });
    },

    delete: function (req, res) {
      StaticDB.modules(_.reject(StaticDB.modules(), {id: Number(req.params.id)}));
      res.end();
    }
  }
};

module.exports = function() {
  var urlrouter = require('urlrouter');

  return urlrouter(function (app) {
    app.get('/api/modules', API.modules.get);
    app.post('/api/modules', API.modules.post);
    app.put('/api/modules/:id', API.modules.put);
    app.delete('/api/modules/:id', API.modules.delete);
  });
};
