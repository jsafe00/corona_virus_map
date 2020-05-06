import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';

import Layout from 'components/Layout';
import Map from 'components/Map';

const LOCATION = {
  lat: 13.357320, 
  lng: 121.954615
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 6;

const PhPageCases = () => {

  async function mapEffect({ leafletElement: map } = {}) {
    let response;

    try {
      response = await axios.get('https://coronavirus-ph-api.herokuapp.com/doh-data-drop');
    } catch(e) {
      console.log(`Failed to fetch countries: ${e.message}`, e);
      return;
    }

    const { data } = response.data;
    //console.log(data[1].age);
    // const hasData = Array.isArray(data) && data.length > 0;

    // if ( !hasData ) return;

    
    const geoJson = {
      
      type: 'FeatureCollection',
      
      features: data.map((data = []) => {
       // const { coordinates = {} } = data;
        const { latitude:lat, longitude: lng } = data;
        return {
          type: 'Feature',
          properties: {
            ...data,
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

        const {
          case_code,
          age,
          sex,
          is_admitted,
          location,
          region_res,
          date_reported,
          date_died,
          recovered_on,

        } = properties

        const html = `
          <span class="icon2-marker">
            <span class="icon-marker-tooltip">
              <h2>Region: ${region_res}</h2>
              <h2>Location: ${location}</h2>
              -------------------------
              <ul>
                <li><strong>Case Code:</strong> ${case_code}</li>
                <li><strong>Age:</strong> ${age}</li>
                <li><strong>Sex:</strong> ${sex}</li>
                <li><strong>Is Admitted:</strong> ${is_admitted}</li>
                <li><strong>Date Reported:</strong> ${date_reported}</li>
                <li><strong>Date Died:</strong> ${date_died}</li>
                <li><strong>Recovered On:</strong> ${recovered_on}</li>
                <br/>
              </ul>
            </span>
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

export default PhPageCases;