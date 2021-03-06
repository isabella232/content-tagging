'use strict';
const MapboxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoder = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxTokens = require('@mapbox/mapbox-sdk/services/tokens');

const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const client = MapboxClient({
  accessToken: token
});

// Validate token
const tokenService = mbxTokens(client);
const scopesReq = tokenService.getToken();
scopesReq.query = { pluginName: 'content-tagging' };
scopesReq.send().then(resp => console.log(resp));

const geocoderService = mbxGeocoder(client);

const geocode = async data => {
  var config = {
    query: [
      parseFloat(data.coordinates[0], 10),
      parseFloat(data.coordinates[1], 10)
    ],
    limit: 1,
    mode: 'mapbox.places-permanent'
  };

  // Documentation on the geocoder service: https://github.com/mapbox/mapbox-sdk-js/blob/master/docs/services.md#reversegeocode
  const geocoderReq = geocoderService.reverseGeocode(config);
  geocoderReq.query = { pluginName: 'content-tagging' };

  var response = await geocoderReq.send();
  if (response.statusCode == '200' && response.body.features) {
    const feature = response.body.features[0];
    console.log(feature);
    return feature;
  } else {
    console.error('Geocoding error, please email solutions@mapbox.com gain access to Permanent Geocodes!');
    throw 'Geocoding error, please email solutions@mapbox.com gain access to Permanent Geocodes!';
  }
};

module.exports = { geocode };
