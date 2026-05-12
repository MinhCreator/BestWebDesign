import React from 'react';

const MapSection = () => {
    return (
      <>
        <h1 className="flex ml-10 font-bold text-emerald-900 text-4xl">
          DA NANG RACE MAP
        </h1>
        <div className="map-box">
          <iframe
            src="https://maps.google.com/maps?q=Đà%20Nẵng&t=&z=12&ie=UTF8&iwloc=&output=embed"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </>
    );
}

export default MapSection;