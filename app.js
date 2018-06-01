var express     = require('express'),
    app         = express(),
    ejs         = require('ejs'),
    bodyParser  = require('body-parser'),
    mongo       = require('mongodb').MongoClient,
    http        = require('http'),
    bl          = require('bl');
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var mongoUrl = "mongodb://" + process.env.MADE_WITH + ":" + process.env.SECRET + "@ds259499.mlab.com:59499/freecodecamp-playground";

// var imgur_CLient_Id     = "65b30e9115e68d4",
//     imgur_Client_Secret = "b36d5a26b4784981ff79d0c48768c37bf1c3f3e3";

var pixabayUrl = "http://pixabay.com/api/?key=8830246-e104651caa6de75cf4d80dafd&q=yellow+flowers&image_type=photo";

app.get('/', function (req, res) {
    res.render("index");
});

app.get('/api/search/:searchterm', function (req, res) {
    var termsArr = req.params.searchterm.split('%20').join('+');
    var pixabayUrlTerm = "http://pixabay.com/api/?key=8830246-e104651caa6de75cf4d80dafd&q=" + termsArr + "&image_type=photo";
    
   http.get(pixabayUrlTerm, function (responce) {
       responce.pipe(bl(function (err, data) {
           if (err) throw err;
           var parsedData = JSON.parse(data.toString());
           var parsedHits = parsedData.hits;
           
            var rangeMax = Number( req.query.offset ? req.query.offset : 10 );
            if (req.query.offset > parsedHits.length) { rangeMax = parsedHits.length }
            var rangeMin = rangeMax < 10 ? 0 : rangeMax - 10;
            
            console.log(rangeMin, rangeMax);
           
        //   console.log(parsedData.hits[0].user);
           var filteredData = parsedHits.map(function (each, index) {
               return {
                   url: each.webformatURL,
                   user: each.user,
                   tags: each.tags,
                   likes: each.likes,
                   comments: each.comments,
                   downloads: each.downloads
               }
           });
           mongo.connect(mongoUrl, function (err, client) {
               if (err) throw err;
               var db = client.db('freecodecamp-playground');
               var collection = db.collection('image-abstractor-logs');
               collection.insertOne({
                   term: termsArr.toString(),
                   date: new Date().toISOString()
               }, function (err, data) {
                  if (err) throw err;
                  console.log("New Search Logged!");
               });
           })
           res.setHeader('Content-Type', 'application/json');
           res.send(JSON.stringify(filteredData.slice(rangeMin, rangeMax)));
       }));
    });
});

app.get('/api/search_logs', function (req, res) {
    mongo.connect(mongoUrl, function (err, client) {
        if (err) throw err;
        var db = client.db('freecodecamp-playground');
        var collection = db.collection('image-abstractor-logs');
        // collection.count({}, function (err, count) {
        //     if (err) throw err;
        //     console.log(count);
            
        // })
        collection.find({}).toArray(function (err, data) {
            if (err) throw err;
            var maxRange = data.length;
            var minRange = data.length > 20 ? data.length-20 : 0;
            var parsedData = data.slice(minRange, maxRange)
            var output = parsedData.map(function (each, index) {
                return {
                    term: each.term,
                    date: each.date
                }
            });
            console.log(output);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(output));
        })
    })
});

app.listen(process.env.PORT | 3000, function () {
    console.log("Server initialised...");
});
