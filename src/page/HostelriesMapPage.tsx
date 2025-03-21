import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {getBoardingsByLocationBounds} from "../reducers/HostelSlice";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { CircularProgress } from "@mui/material";
import LoadingBar from "react-top-loading-bar";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import hostelIcon from "../../src/assets/image/hostel-icon.svg";
import { MenuIcon, Star, ArrowRight, Users, Coffee, Phone } from "lucide-react";
import { IHostel, ILocationBounds } from "../types/types.ts";
import { AppDispatch, RootState } from "../store/Store.ts";
import "../assets/style/hostelry.css"

// Component to listen to map movements and update bounds
function MapBoundsListener({ onBoundsChange }: { onBoundsChange: (bounds: ILocationBounds) => void }) {
    const map = useMap();
    const prevBoundsRef = useRef<ILocationBounds | null>(null);

    useEffect(() => {
        const updateBounds = () => {
            const bounds = map.getBounds();
            const newBounds: ILocationBounds = {
                neLat: bounds.getNorthEast().lat,
                neLng: bounds.getNorthEast().lng,
                swLat: bounds.getSouthWest().lat,
                swLng: bounds.getSouthWest().lng,
            };

            if (!prevBoundsRef.current || JSON.stringify(prevBoundsRef.current) !== JSON.stringify(newBounds)) {
                prevBoundsRef.current = newBounds;
                onBoundsChange(newBounds);
            }
        };

        map.on("moveend", updateBounds);
        updateBounds();

        return () => {
            map.off("moveend", updateBounds);
        };
    }, [map, onBoundsChange]);

    return null;
}

function HostelriesMapPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { hostels, isLoading, error } = useSelector((state: RootState) => state.hostel);
    const [progress, setProgress] = useState<number>(0);

    const defaultLocation = { lat: 6.9271, lng: 79.8612 };

    const handleBoundsChange = (bounds: ILocationBounds) => {
        setProgress(30);
        dispatch(getBoardingsByLocationBounds(bounds)).finally(() => setProgress(100));
    };

    const customIcon = L.icon({
        iconUrl: hostelIcon,
        iconSize: [40, 40],
    });


    return (
        <div className="relative mt-[6vh]">
            <LoadingBar color="#FF6F00" progress={progress} onLoaderFinished={() => setProgress(0)} />

            {isLoading && (
                <CircularProgress className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
            )}

            {error && <p className="text-red-500 text-center absolute top-4 left-1/2 transform -translate-x-1/2">{error}</p>}

            {/* Fullscreen Map */}
            <MapContainer
                center={defaultLocation}
                zoom={13}
                style={{ height: "83vh", width: "100vw" }}
                className="absolute inset-0 z-0"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapBoundsListener onBoundsChange={handleBoundsChange} />

                {hostels.map((boarding: IHostel) => (
                    <Marker
                        key={boarding._id}
                        position={[boarding.location.latitude, boarding.location.longitude]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="hostel-popup-content">
                                {/* Image Preview with image carousel indicator */}
                                <div className="relative">
                                    <div className="overflow-hidden">
                                        <img
                                            src={boarding.photos[0] || "/placeholder.jpg"}
                                            alt={boarding.title}
                                            className="w-full h-36 object-cover hostel-popup-image"
                                        />
                                    </div>

                                    {/* Small dots indicating multiple images */}
                                    {boarding.photos.length > 1 && (
                                        <div className="absolute bottom-2 flex justify-center w-full">
                                            <div className="flex space-x-1">
                                                {boarding.photos.slice(0, 5).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-1.5 h-1.5 rounded-full bg-white ${index === 0 ? 'opacity-100' : 'opacity-60'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Category badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                            {boarding.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Title & rating */}
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-1">
                                            {boarding.title}
                                        </h3>
                                        <div className="flex items-center">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-medium ml-1">4.8</span>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <p className="text-xs text-gray-500 mb-2">
                                        {boarding.city}, {boarding.genderPreference}
                                    </p>

                                    {/* Amenities */}
                                    <div className="flex space-x-3 mb-3">
                                        <div className="flex items-center text-xs text-gray-600">
                                            <Users className="h-3 w-3 mr-1" />
                                            <span>{boarding.capacity}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-600">
                                            <Coffee className="h-3 w-3 mr-1" />
                                            <span>{boarding.foodAvailability ? "Food" : "No food"}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-600">
                                            <Phone className="h-3 w-3 mr-1" />
                                            <span className="truncate">{boarding.mobileNo}</span>
                                        </div>
                                    </div>

                                    {/* Price and button */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-base text-gray-900">
                                                Rs {boarding.rent.toLocaleString()}
                                                <span className="text-xs font-normal text-gray-500 ml-1">/month</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/hostel-details?id=${boarding._id}`)}
                                            className="flex items-center justify-center bg-orange-600 cursor-pointer text-white text-xs font-medium rounded-md px-3 py-1.5 hover:bg-orange-700 transition-colors"
                                        >
                                            View
                                            <ArrowRight className="h-3 w-3 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Floating "Show List" Button */}
            <button
                onClick={() => navigate("/hostelries")}
                className="fixed bottom-22 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white cursor-pointer rounded-full px-6 py-4 flex items-center space-x-2 shadow-md hover:bg-black transition-all duration-300"
            >
                <MenuIcon className="text-xl" />
                <span className="text-sm font-medium">Show List</span>
            </button>
        </div>
    );
}

export default HostelriesMapPage;