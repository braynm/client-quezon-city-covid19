import React, { useState, useEffect } from 'react';
import Downshift from 'downshift';
import { compose, flatten, map, pick, values } from 'ramda';
import {
  Map,
  Marker,
  TileLayer,
  Popup,
  Polygon
} from 'react-leaflet';

import 'bulma/css/bulma.css'
import './App.css';

import TooltipReport from './components/TooltipReport'
import { REACT_APP_BASE_URL } from './environment'

function App(props) {
  const [barangays, setBarangays] = useState([])
  const [zoom, setZoom] = useState(15)
  const [boundary, setBoundary] = useState(0)
  const [marker, setMarkerPosition] = useState(null)
  const [polygon, setPolygon] = useState(0)
  const [report, setReport] = useState({})
  const [disabledInput, setDisabledInput] = useState(true)
  useEffect(() => {
    fetch(`${REACT_APP_BASE_URL}/api/reports/city/quezon-city`)
      .then(response => response.json())
      .then((data) => {
        const { result } = data
        setBarangays(data)
        setBoundary([14.655012249999999, 121.03174620638671]) // Set Quezon City as center view

        const extractBarangay = pick(['barangays'])
        const transformData = compose( // TODO: Convert to reduce
          flatten,
          map(values),
          map(extractBarangay)
        )


        const barangays = transformData(result);
        setBarangays(barangays);
    })

  }, [])


  const clickPolygon = e => {
    setMarkerPosition(e.latlng)
  }

  const getBrgyBoundary = (brgy) => {
    // TODO: convert to async/await
    fetch(`${REACT_APP_BASE_URL}/api/reports/city/quezon-city/boundary/${brgy.id}`)
      .then(response => response.json())
      .then((data) => {
        const lat = data.result.centre.lat
        const lng = data.result.centre.lng
        setBoundary([data.result.centre.lat, data.result.centre.lng])
        setZoom(15)
        setPolygon(data.result.brgy_boundaries)

      fetch(`${REACT_APP_BASE_URL}/api/reports/city/quezon-city/barangay/${brgy.id}/report`)
        .then(response => response.json())
        .then((data) => {
          setMarkerPosition([lat, lng])
          setReport(data)
      })
    })
  }

  return (
    <div className="App">
      <div className="columns">
        <div className="column is-12 map-container">
            <Map animate={true} className="map" center={boundary} zoom={zoom}>
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
            <div className="search-form">
                <Downshift
                  onChange={getBrgyBoundary}
                  itemToString={item => (item ? item.name : '')}
                >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  highlightedIndex,
                  getMenuProps,
                  getRootProps,
                  }) => (
                    <div>
                      <div className="field">
                        <div className="control">
                          <input className="input is-primary is-large" {...getInputProps()} type="text" placeholder="Search Barangay"/>
                        </div>
                      </div>
                        {barangays && barangays.length > 0 && (
                          <ul {...getMenuProps()}>
                            {isOpen && barangays.filter(brgy => brgy.name.toLowerCase().includes(inputValue.toLowerCase())).map((brgy, index) => (
                              <li
                                key={brgy.name}
                                {...getItemProps({
                                  key: brgy.name,
                                  item: brgy,
                                index,
                                style: {
                                  backgroundColor: highlightedIndex === index ? '#ddd' : '#fff'
                                }
                                })}
                              >{brgy.name}</li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}
              </Downshift>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
