import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';

import Layout from 'components/Layout';
import Map from 'components/Map';

import { commafy } from 'lib/util';

const LOCATION = {
  lat: 30.929614,
  lng: -100.835489
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 4;

const USAPage = () => {

  async function mapEffect({ leafletElement: map } = {}) {
    let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/v2/jhucsse');
    } catch(e) {
      console.log(`Failed to fetch countries: ${e.message}`, e);
      return;
    }

    const { data = [] } = response;
    const hasData = Array.isArray(data) && data.length > 0;

    if ( !hasData ) return;

    
    const geoJson = {
      
      type: 'FeatureCollection',
      
      features: data.map((country = {}) => {
        const { coordinates = {} } = country;
        const { latitude:lat, longitude: lng } = coordinates;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        }
      
      })
    
    }
  

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let casesString;

        const {
          updatedAt,
          country,
          province,
          stats
     
        } = properties
        casesString = `${stats.confirmed}`;

        if ( stats.confirmed > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }

        if(country === 'US'){
        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>State: ${province}</h2>
              -------------------------
              <ul>
                <li><strong>Confirmed:</strong>${commafy(stats.confirmed)}</li>
                <li><strong>Deaths:</strong> ${commafy(stats.deaths)}</li>
                <li><strong>Recovered:</strong> ${commafy(stats.recovered)}</li>
                <br/>
                <li><strong>Last Update:</strong> ${updatedAt}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;

        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    }
    });

    geoJsonLayers.addTo(map)
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'Mapbox',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Covid-19</title>
      </Helmet>

      <Map {...mapSettings} />
    </Layout>
  );
};

export default USAPage;