var request = require('request')
var _ = require('underscore')
var fs = require('fs')

var makers = [];
request.get({ url: 'http://api.formagg.io/maker/search?name=b&size=500', json: true }, function(err, data) {

  _.each(data.body.results, function(maker) {
  	if (maker.location.lat && maker.location.lng) {
  	  var d = { 
  	  	"type": "Feature", 
  	    "id": maker._id.toString(), 
  	    "properties": { 
  	    	"Name": maker.name || 'NA', 
  	    	"Country": maker.country || '',
  	    	"State": maker.state | '' 
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

  console.log(geojson)
})

