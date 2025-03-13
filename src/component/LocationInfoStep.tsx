import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store.ts";
import { updateFormData } from "../reducers/HostelSlice.ts";
import { Search } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import Swal from "sweetalert2";

interface LocationInfoStepProps {
    updateNextState: (value: boolean) => void;
}

function LocationInfoStep({ updateNextState }: Readonly<LocationInfoStepProps>) {
    const dispatch = useDispatch();
    const { city, location } = useSelector((state: RootState) => state.hostel.formData);

    const DEFAULT_POSITION = { latitude: 6.9271 , longitude: 79.8612  };
    const [position, setPosition] = useState<{ latitude: number; longitude: number }>(
        location?.latitude ? location : DEFAULT_POSITION
    );
    const [cityName, setCityName] = useState(city || "");
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        updateNextState(!!(cityName.trim() && position.latitude && position.longitude));
    }, [cityName, position, updateNextState]);

    function LocationMarker() {
        useMapEvents({
            click: async (e: any) => {
                const { lat, lng } = e.latlng;
                setPosition({ latitude: lat, longitude: lng });

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                    const data = await response.json();
                    const cityFromApi = data.address.city || data.address.town || data.address.village || "Unknown";

                    setCityName(cityFromApi);
                    dispatch(updateFormData({ city: cityFromApi, location: { latitude: lat, longitude: lng } }));
                } catch (error) {
                    console.error("Error fetching city name:", error);
                }
            }
        });

        return <Marker position={[position.latitude, position.longitude]} />;
    }

    function MapUpdater() {
        const map = useMap();

        useEffect(() => {
            map.setView([position.latitude, position.longitude]);
        }, [position, map]);

        return null;
    }

    const handleSearch = async () => {
        if (!cityName.trim()) return;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${cityName}&format=json&limit=1`);
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                const newPosition = { latitude: parseFloat(lat), longitude: parseFloat(lon) };

                setPosition(newPosition);
                dispatch(updateFormData({ city: cityName, location: newPosition }));
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "City Not Found",
                    text: "Please enter a valid city.",
                    confirmButtonColor: "#d33",
                });
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while fetching the location.",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center sm:px-[6vw]">
            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-medium text-center mb-6 z-50">
                Where can people find your boarding house?
            </h2>

            {/* City Input */}
            <div className={`w-full max-w-md flex items-center bg-white shadow-md rounded-full px-4 py-2 ${isMobile ? "mb-4" : "absolute top-[8%] left-1/2 transform -translate-x-1/2 z-[1000]"}`}>
                <input
                    type="text"
                    className="w-full px-2 py-2 text-gray-700 text-sm sm:text-lg focus:outline-none"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="Enter city name..."
                />
                <button onClick={handleSearch} className="ml-2">
                    <Search size={24} className="text-gray-700 cursor-pointer mr-2" />
                </button>
            </div>

            {/* Map Container */}
            <div className={`w-full ${isMobile ? "h-[65vh]" : "h-[62vh]"}`}>
                <MapContainer
                    // @ts-ignore
                    center={[position.latitude, position.longitude]}
                    zoom={12}
                    className="w-full h-full rounded-lg shadow-md"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapUpdater />
                    <LocationMarker />
                </MapContainer>
            </div>
        </div>
    );
}

export default LocationInfoStep;
