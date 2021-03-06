var request = require('request')
    , _     = require('underscore')
    , fs    = require('fs')
    , argv  = require('optimist').argv
    , querystring = require('querystring')
    , makers = []
    , params = { size: 20000 }

if (argv.country) params.country = argv.country
var filename = (argv.country || 'all') + '.geojson'

request.get({ url: 'http://api.formagg.io/maker/search?' + querystring.stringify(params), json: true }, function(err, data) {

  _.each(data.body.results, function(maker) {
  	if (maker.location.lat && maker.location.lng) {
  	  var img = maker.logourl ? '<img src="' + (maker.logourl || '') + '"><br>' : ''

  	  var data = { 
  	  	"type": "Feature", 
  	    "id": maker._id.toString(), 
  	    "properties": {
  	    	"marker-symbol": "warehouse",
  	    	"marker-size": "small",
  	    	"stroke-width": 1,
  	    	"Maker": maker.name || 'NA',
  	    	"Where": (maker.country || '') + ' ' + (maker.state || ''),
  	    	"Summary": img + '<a href="http://api.formagg.io/maker/' + maker._id + '">Raw JSON</a>',
  	    }, 
  	    "geometry": { 
  	    	"type": "Point", 
  	    	"coordinates": [ maker.location.lng, maker.location.lat ] 
  	    } 
  	  }

  	  makers.push(data)
  	}
  })

  var geojson = { "type": "FeatureCollection", "features": makers }

  fs.writeFile('./' + filename, JSON.stringify(geojson, null, 4), function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  })
})

