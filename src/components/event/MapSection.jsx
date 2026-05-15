import React from 'react';

const MapSection = () => {
  const mapdir ="!1m26!1m12!1m3!1d61354.80073295449!2d108.21738995181154!3d16.030422764135587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e2!4m3!3m2!1d16.0679729!2d108.246479!4m5!1s0x314210dcc92cfa5f%3A0x6426dff2323ae607!2zQsOjaSBiaeG7g24gTm9uIE7GsOG7m2MsIE5nxakgSMOgbmggU8ahbiwgxJDDoCBO4bq1bmcgNTUwMDAwLCBWaeG7h3QgTmFt!3m2!1d15.995533499999999!2d108.2738648!5e0!3m2!1svi!2s!4v1778806725639!5m2!1svi!2s";  
  
  return (
    <>
      <h1 className="flex ml-10 font-bold text-emerald-900 text-4xl">
        DA NANG RACE MAP
      </h1>
      <div className="map-box">
        <iframe
          src={`https://www.google.com/maps/embed?pb=${mapdir}`}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
}

export default MapSection;