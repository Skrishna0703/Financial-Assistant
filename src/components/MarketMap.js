import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MarketMap = ({ marketData }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  };

  const center = {
    lat: 40.7128, // New York Stock Exchange coordinates
    lng: -74.0060
  };

  return (
    <div className="market-map">
      <h3>Global Market Overview</h3>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={2}
        >
          {marketData.map((market, index) => (
            <Marker
              key={index}
              position={market.coordinates}
              title={market.name}
              label={market.status}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MarketMap; 