﻿/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.3.js" />
/// <reference path="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0" />

// ----------
$(document).ready(function () {
	gis.init();
});

// ----------
window.gis = {
	map: null,
	watchID: null,
	$autoCheckbox: null, 

	// ----------
	init: function () {
		var self = this;
    
    // ___ map
		this.map = new Microsoft.Maps.Map($("#main-map")[0], {credentials: config.mapKey});

		Microsoft.Maps.Events.addHandler(this.map, "click", function(event) {
  		if (event.targetType == "map") {
  			var point = new Microsoft.Maps.Point(event.getX(), event.getY());
  			var loc = event.target.tryPixelToLocation(point);
  			var pin = new Microsoft.Maps.Pushpin(loc, {
  				icon: "Images/SmithIsland.gif",
  				width: 73,
  				height: 94
  			});
  			
  			self.map.entities.push(pin);
  		}
		});
    
    // ___ buttons
    this.$autoCheckbox = $("#auto").change(function() {
      self.setAutoLocate(self.$autoCheckbox[0].checked);
    });

		// ___ get started
		if (Modernizr.geolocation)
		  this.setAutoLocate(true);
	}, 
	
	// ----------
	setAutoLocate: function(value) {
    var self = this;
    
    if (this.auto == value)
      return;
      
    if (value && !Modernizr.geolocation) {
      alert("This browser does not support geolocation.");
      return;
    }
      
    this.auto = value;
    this.$autoCheckbox[0].checked = this.auto;
    
    if (this.auto) {
		  function updateForPosition(position) {
    		var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
    		var a = Math.min(25000, position.coords.accuracy) / 5000;
    		var zoom = 16 - Math.round(a);
    		self.map.setView({
  				zoom: zoom,
  				center: loc,
  			});
  		}
  		
  		function positionError(error) {
  		  if (error.code == 1)
  		    alert("Please enable geolocation!");
  		  else if (error.code == 2)
  		    alert("Unable to get location.");
  		  else if (error.code == 3)
  		    alert("Timeout while getting location.");
  		  else
  		    alert("Unknown error while getting location.");
  		    
  		  self.setAutoLocate(false);
  		}
  		
  		this.watchID = navigator.geolocation.watchPosition(updateForPosition, positionError, {
  		  enableHighAccuracy: true, 
  		  maximumAge: 30000
  		});
    } else {
      navigator.geolocation.clearWatch(this.watchID);
      this.watchID = null;
    }
	}
};
