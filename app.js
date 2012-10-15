
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , file = require('file')
  , YAML = require('js-yaml')
  , Markdown = require('markdown').markdown
  , app = express();

// HELPERS

// MIDDLEWARE

// gets text from localization files
var localeMiddleware = function (req, res, next) {
  var locale = req.query.lang || "en"
    , i18n = require("./locales/"+locale+".yml");
  res.locals.i18n = i18n;
  next();
};

var parsePages = {
  pages: {},
  root: app.get('flatpages-root') || 'pages',
  ext: app.get('flatpages-ext') || '.md',
  encoding: app.get('flatpages-encoding') || 'utf8',
  parse: function(string) {
    var split = '\n\n'
      , i = string.indexOf(split)
      , result = YAML.load(string.substr(0,i));
    result.content = Markdown.toHTML(string.substr(i));
    return result;
  },
  get_pages: function() {
    var self = this;
    file.walk(this.root, function(err, dirPath, dirs, files) {
      if (err) {
        console.log(err);
      } else {
        files.forEach(function (fileName) {
          if (fileName.indexOf(self.ext) !== -1) {
            fs.readFile(fileName, self.encoding, function(err, string) {
              if (err) {
                console.log(err);
              } else {
                self.pages[fileName] = self.parse(string);
              }
            });
          } else {
            // console.log("extension not found :(");
          }
        });
      }
    });
  },
  render_page: function(req, res) {
    var file_path = ['pages', req.params.folder, req.params.name].join(path.sep);
    res.send(parsePages.pages[file_path]);
  },
  render_all: function(req, res) {
    var result = [],
        pages = parsePages.pages;
    for (page in pages) {
      pages[page].id = page;
      result.push(pages[page]);
    }
    res.send(result);
  }
};

parsePages.get_pages(); // get flatpages

// CONFIG

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // my middleware
  app.use(require('connect-assets')({
    src: "public",
    buildDir: "assets",
    build: true
  }));
  app.use(localeMiddleware);
  // end my middleware
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// ROUTES

app.get('/', function(req, res){
    var result = [],
        pages = parsePages.pages
        i18n = res.locals.i18n;
    for (var folder in i18n) {
      for (var page in i18n[folder]) {
        var self = i18n[folder][page];
        if (self.content) self.content = Markdown.toHTML(self.content);
        pages[['pages', folder, page].join(path.sep)] = self;
      }
    }
    for (page in pages) {
      pages[page].id = page;
      result.push(pages[page]);
    }
    res.render('index', { pages: result });
});
app.get('/api/v1/:folder/:name', parsePages.render_page);
app.get('/api/v1/pages', parsePages.render_all)


// START

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
