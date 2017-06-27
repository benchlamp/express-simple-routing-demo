var path = require("path"),
    express = require("express"),
    zipdb = require("zippity-do-dah"),
    forecastIo = require("forecastio"),
    nodeGeocoder = require("node-geocoder");
    

var app = express(),
    weather = new forecastIo("75f7f0fd7d74ed9d7c22bf05397cc06d"),
    geocoder = nodeGeocoder();
    

app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("index");
});

app.get(/^\/(\d{5})$/, function(req, res, next) {
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode);
    var latitude = location.latitude;
    var longitude = location.longitude;
    console.log(location);
    
  if(!location.zipcode) {
        next();
        return;
    }
   
   

       weather.forecast(latitude, longitude, function(err, data) {
           if (err) {
               next();
               return;
           }
           
           res.json({
               zipcode: zipcode,
               temperature: Math.round((data.currently.temperature - 32) * 5 / 9, 0) + "C"
           });
       });
   

   
});

app.use(function(req, res) {
    res.status(404).render("404");
});

app.listen(process.env.PORT);

