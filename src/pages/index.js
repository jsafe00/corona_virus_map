import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';

import { useTracker } from 'hooks';
import { commafy, friendlyDate } from 'lib/util';

import Layout from 'components/Layout';
import Map from 'components/Map';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const IndexPage = () => {

  const { data: stats = {} } = useTracker({
    api: 'all'
  });

  const { data: countries = [] } = useTracker({
    api: 'countries'
  });

  const dashboardStats = [
    {
      primary: {
        label: 'Total Cases',
        value: stats ? commafy(stats?.cases) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats ? commafy(stats?.casesPerOneMillion) : '-'
      }
    },
    {
      primary: {
        label: 'Total Deaths',
        value: stats ? commafy(stats?.deaths) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats ? commafy(stats?.deathsPerOneMillion) : '-'
      }
    },
    {
      primary: {
        label: 'Total Tests',
        value: stats ? commafy(stats?.tests) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats ? commafy(stats?.testsPerOneMillion) : '-'
      }
    },
    {
      primary: {
        label: 'Active Cases',
        value: stats ? commafy(stats?.active) : '-'
      }
    },
    {
      primary: {
        label: 'Critical Cases',
        value: stats ? commafy(stats?.critical) : '-'
      }
    },
    {
      primary: {
        label: 'Recovered Cases',
        value: stats ? commafy(stats?.recovered) : '-'
      }
    }
  ]


  async function mapEffect({ leafletElement: map } = {}) {
    let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/v2/countries');
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
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
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
        let updatedFormatted;
        let casesString;
        let province;
        let dohdata;

        const {
          country,
          updated,
          cases,
          deaths,
          recovered,
          continent,
          todayCases,
          todayDeaths,
          active,
          critical,
          tests,
          countryInfo,
     
        } = properties

        casesString = `${cases}`;

        if ( cases > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }

        if ( updated ) {
          updatedFormatted = new Date(updated).toLocaleString();
        }

        if(country === 'USA'){
          province = `<h2><a href="/usa-page">By state</a><h2>`
          dohdata = ``
        }else if (country === "China"){
          province = `<h2><a href="/china-page">By province</a><h2>`
          dohdata = ``
        }else if (country === "Australia"){
          province = `<h2><a href="/australia-page">By province</a><h2>` 
          dohdata = ``
        }else if (country === "United Kingdom"){
          province = `<h2><a href="/uk-page">By province</a><h2>`  
          dohdata = `` 
        }else if (country === "Canada"){
          province = `<h2><a href="/canada-page">By province</a><h2>` 
          dohdata = ``
        }else if (country === "France"){
          province = `<h2><a href="/france-page">By province</a><h2>` 
          dohdata = ``  
        }else if (country === "Denmark"){
          province = `<h2><a href="/denmark-page">By province</a><h2>`
          dohdata = `` 
        }else if (country === "Netherlands"){
          province = `<h2><a href="/netherlands-page">By province</a><h2>`
          dohdata = `` 
        }else if (country === "Philippines"){
          dohdata = `<li><a href="/ph-page">PH DOH DATA</a></li>`   
          province = ``
        }else{
          province = ``
          dohdata = ``
        }       
        
        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
             
              <h2><img src = '${countryInfo.flag}' height='20px' width='30px'> ${country}</h2>
              <h2>${province}</h2>
              <h2>${continent}</h2>
              <ul>
              <li><strong>Today's Cases:</strong> ${commafy(todayCases)}</li>
              <li><strong>Today's Deaths:</strong> ${commafy(todayDeaths)}</li>
              </ul>
              -------------------------
              <ul>
                <li><strong>Confirmed:</strong> ${commafy(cases)}</li>
                <li><strong>Deaths:</strong> ${commafy(deaths)}</li>
                <li><strong>Recovered:</strong> ${commafy(recovered)}</li>
                <li><strong>Active:</strong> ${commafy(active)}</li>
                <li><strong>Critical:</strong> ${commafy(critical)}</li>
                <li><strong>Tests:</strong> ${commafy(tests)}</li>
                <br/>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
                <li>${dohdata}</li>
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

      <div className="tracker-stats">
          <ul>
            { dashboardStats.map(({ primary = {}, secondary = {} }, i) => {
              return (
                <li key={`Stat-${i}`} className="tracker-stat">
                  { primary.value && (
                    <p className="tracker-stat-primary">
                      { primary.value }
                      <strong>{ primary.label }</strong>
                    </p>
                  )}
                  { secondary.value && (
                    <p className="tracker-stat-secondary">
                      { secondary.value }
                      <strong>{ secondary.label }</strong>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="tracker-last-updated">
          <p>
            Last Updated: { stats ? friendlyDate(stats?.updated) : '-' }
          </p>
        </div>
    </Layout>
  );
};

export default IndexPage;