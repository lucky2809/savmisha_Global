import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapView = () => {
  return (
    <div className="h-full w-full">
      <MapContainer center={[27.207188363054783, 78.05208795599056]} zoom={13} className="h-full w-full z-0 rounded-2xl">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[27.207188363054783, 78.05208795599056]}>
          <Popup>
            You are here! <br /> New Delhi
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
