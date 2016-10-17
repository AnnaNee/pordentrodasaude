angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Markers', function($http) {
  var markers = [];
 
  return {
    getMarkers: function(){
      return $http.get('http://localhost:8100/model/markers.json').then(function(response) {
        markers = response;
        return markers;
      })
    },

    getMarker: function(id){
    }
  }
})

.factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading, $rootScope, $cordovaNetwork, Markers, ConnectivityMonitor) {
  var apiKey = false;
  var map = null;
 
  function initMap(){
    var options = {timeout: 10000, enableHighAccuracy: true};
 
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      var mapOptions = {
        center: latLng,
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
      google.maps.event.addListenerOnce(map, 'idle', function(){
        enableMap();
        loadMarkers();
      });

    }, function(error){
      console.log("Não foi possível carregar localização");
        loadMarkers();
    });
  }

  function buildSearchBox() {
    var input = document.getElementById("searchBox");
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    google.maps.event.addListener(autocomplete, 'places_changed', function() {
      var place = autocomplete.getPlaces();

      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPlace( /** @type {!google.maps.Place} */ ({
        placeId: place.place_id,
        location: place.geometry.location
      }));
      marker.setVisible(true);
    });
  }

  function enableMap(){
    $ionicLoading.hide();
  }
 
  function disableMap(){
    $ionicLoading.show({
      template: 'Você precisa estar conectado a internet para visualizar este mapa.'
    });
  }
 
  function loadGoogleMaps(){
    $ionicLoading.show({
      template: 'Carregando Google Maps...'
    });
 
    window.mapInit = function(){
      initMap();
    };  
 
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";
 
    if(apiKey){
      script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey + '&libraries=places&callback=mapInit';
    }
    else {
      script.src = 'http://maps.google.com/maps/api/js&callback=mapInit&libraries=places';
    }
 
    document.body.appendChild(script);
  }
 
  function checkLoaded(){
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      loadGoogleMaps();
    } else {
      enableMap();
    }       
  }
 
  function loadMarkers() {
      Markers.getMarkers().then(function(markers){
        console.log("Markers: ", markers);
 
        var records = markers.data;
 
        for (var i = 0; i < records.length; i++) {
          var record = records[i];
          var markerPos = new google.maps.LatLng(record.lat, record.lng);
 
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });

          buildSearchBox();
 
          var infoWindowContent = "<h4>" + record.title + "</h4>";          
 
          addInfoWindow(marker, infoWindowContent, record);
        }
      }); 
  }
 
  function addInfoWindow(marker, message, record) {
      var infoWindow = new google.maps.InfoWindow({
          content: message
      });
 
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });
  }

  function addConnectivityListeners() {
    if (ionic.Platform.isWebView()) {
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        checkLoaded();
      });
 
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        disableMap();
      });
    } else {
      window.addEventListener("online", function(e) {
        checkLoaded();
      }, false);    
 
      window.addEventListener("offline", function(e) {
        disableMap();
      }, false);  
    }
  }

  return {
    init: function(key){
 
      if (typeof key != "undefined") {
        apiKey = key;
      }
 
      if(typeof google == "undefined" || typeof google.maps == "undefined"){
 
        console.warn("Google Maps SDK precisa ser carregado.");
 
        disableMap();
 
        if (ConnectivityMonitor.isOnline()) {
          loadGoogleMaps();
        }
      } else {
        if (ConnectivityMonitor.isOnline()) {
          initMap();
          enableMap();
        } else {
          disableMap();
        }
      }
 
      addConnectivityListeners();
    }
  }
})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
  return {
    isOnline: function(){
 
      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();    
      } else {
        return navigator.onLine;
      }
 
    },
    ifOffline: function(){
 
      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();    
      } else {
        return !navigator.onLine;
      }
 
    }
  }
})

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name == 'admin' && pw == 'admin') {
                deferred.resolve('Bem vindo, ' + name + '!');
            } else {
                deferred.reject('Login ou senha incorretos.');
            }

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        }
    }
});
