import React, { useState, useEffect } from 'react';
import { compose, flatten, map, pick, values } from 'ramda';
import {
  Map,
  Marker,
  TileLayer,
  Popup,
  Polygon,
} from 'react-leaflet';

import 'bulma/css/bulma.css';
import './App.css';

import TooltipReport from './components/TooltipReport';
import Search from './Search';
import { REACT_APP_BASE_URL } from './environment';

function App(props) {
  const [barangays, setBarangays] = useState([]);
  const [zoom, setZoom] = useState(15);
  const [boundary, setBoundary] = useState(0);
  const [marker, setMarkerPosition] = useState(null);
  const [polygon, setPolygon] = useState(0);
  const [report, setReport] = useState({});
  const [disabledInput, setDisabledInput] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${REACT_APP_BASE_URL}/api/reports/city/quezon-city`)
      .then(response => response.json())
      .then((data) => {
        const { result } = data;
        setBarangays(data);
        setBoundary([14.655012249999999, 121.03174620638671]); // Set Quezon City as center view
        setLoading(false);

        const extractBarangay = pick(['barangays']);
        // TODO: Convert to reduce
        const transformData = compose(
          flatten,
          map(values),
          map(extractBarangay),
        );

        const barangays = transformData(result);
        setBarangays(barangays);
      });
  }, []);


  const clickPolygon = (e) => {
    setMarkerPosition(e.latlng);
  };

  const getBrgyBoundary = (brgy) => {
    setLoading(true);
    // TODO: convert to async/await
    fetch(`${REACT_APP_BASE_URL}/api/reports/city/quezon-city/boundary/${brgy.id}`)
      .then(response => response.json())
      .then((data) => {
        const lat = data.result.centre.lat;
        const lng = data.result.centre.lng;
        setBoundary([data.result.centre.lat, data.result.centre.lng]);
        setZoom(15);
        setPolygon(data.result.brgy_boundaries);

        fetch(`${REACT_APP_BASE_URL}/api/reports/city/quezon-city/barangay/${brgy.id}/report`)
          .then(response => response.json())
          .then((data) => {
            setMarkerPosition([lat, lng]);
            setReport(data);
            setLoading(false);
            }).catch(() => {
              setLoading(false);
            })
      });
  };

  return (
      <div className="App">
          <div className="columns">
              <div className="column is-12 map-container">
                  <Map animate className="map" center={boundary} zoom={zoom}>
                      <Polygon color="#1890ff" positions={polygon} />
                      {marker &&
                        <Marker position={marker}>
                          <Popup autoClose={false}>
                            <TooltipReport {...report} />
                          </Popup>
                        </Marker>
                      }
                      <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                  </Map>
                    <Search
                      barangays={barangays}
                      getBrgyBoundary={getBrgyBoundary}
                      loading={loading}
                    />
              </div>
          </div>
      </div>
  );
}

export default App;
