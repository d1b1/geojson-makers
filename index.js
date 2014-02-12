var request = require('request')
var _ = require('underscore')
var fs = require('fs')

var makers = [];
request.get({ url: 'http://api.formagg.io/maker/search?size=2000', json: true }, function(err, data) {

  _.each(data.body.results, function(maker) {
  	if (maker.location.lat && maker.location.lng) {

  	  var img = maker.logourl ? '<img src="' + (maker.logourl || '') + ' style="border:1px solid #000"><br>' : ''

  	  var d = { 
  	  	"type": "Feature", 
  	    "id": maker._id.toString(), 
  	    "properties": {
  	    	"marker-symbol": "warehouse",
  	    	"marker-size": "small",
  	    	"stroke-width": 1,
  	    	"Maker": maker.name || 'NA',
  	    	"Where": (maker.country || '') + ' ' + (maker.state || ''),
  	    	"Summary": img + '<br><a href="http://api.formagg.io/maker/' + maker._id + '" target="_blank">More</a>',
  	    }, 
  	    "geometry": { 
  	    	"type": "Point", 
  	    	"coordinates": [ maker.location.lng, maker.location.lat ] 
  	    } 
  	  }

  	  makers.push(d)
  	}
  })

  var geojson = { "type": "FeatureCollection", "features": makers }

      fs.writeFile("./test.geojson", JSON.stringify(geojson, null, 4), function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	  })

  //console.log(geojson)
})

