import React, { useState, useEffect } from 'react';
import Downshift from 'downshift';
import { compose, flatten, map, pick, values } from 'ramda';
import {
  Map,
  Marker,
  TileLayer,
  Polygon
} from 'react-leaflet';

import './App.css';
import { REACT_APP_BASE_URL } from './environment'

function App(props) {
  const [barangays, setBarangays] = useState([])
  const [zoom, setZoom] = useState(13)
  const [boundary, setBoundary] = useState(0)
  const [marker, setMarkerPosition] = useState(null)
  const [polygon, setPolygon] = useState(0)
  useEffect(() => {
    fetch(`${REACT_APP_BASE_URL}/api/reports/city/quezon-city`)
      .then(response => response.json())
      .then((data) => {
        const { result } = data
        setBarangays(data)
        setBoundary([14.655012249999999, 121.03174620638671])

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
    fetch(`${REACT_APP_BASE_URL}/api/reports/city/quezon-city/boundary/${brgy.id}`)
      .then(response => response.json())
      .then((data) => {
        setBoundary([data.result.centre.lat, data.result.centre.lng])
        setZoom(15)
        setPolygon(data.result.brgy_boundaries)
    })
  }

  return (
    <div className="App">
      <div className="columns">
        <div className="column is-12 map-container">
            <Map animate={true} className="map" center={boundary} zoom={zoom}>
            <Polygon onClick={clickPolygon} color="#1890ff" positions={polygon} />
              {marker &&
                <Marker position={marker}></Marker>
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
                      <input {...getInputProps()} type="text" placeholder="Search Barangay"/>
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
