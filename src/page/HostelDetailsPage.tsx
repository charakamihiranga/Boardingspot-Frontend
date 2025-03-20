import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { AppDispatch, RootState } from "../store/Store.ts";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from "sweetalert2";
import {getHostelById} from "../reducers/HostelSlice.ts";

export default function HostelDetailsPage() {
    const [searchParams] = useSearchParams();
    const hostelId: string | null = searchParams.get("id");
    const dispatch = useDispatch<AppDispatch>();
    const isLoading = useSelector((state:RootState) => state.hostel.isLoading);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);

    useEffect(() => {
        if (hostelId) {
            dispatch(getHostelById(hostelId))
        }
    }, [dispatch, hostelId]);

    const hostel = useSelector((state: RootState) => state.hostel?.selectedHostel);

    // Initialize map after hostel data is loaded
    useEffect(() => {
        if (!isLoading && hostel && mapRef.current && !mapInstanceRef.current) {
            // Create map instance with zoom controls
            const map = L.map(mapRef.current, {
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true
            }).setView(
                [hostel.location.latitude, hostel.location.longitude],
                15
            );

            // Add tile layer (OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            L.marker([hostel.location.latitude, hostel.location.longitude])
                .addTo(map);

            // Store map instance in ref
            mapInstanceRef.current = map;

            // Invalidate size after a short delay to handle any layout shifts
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }

        // Cleanup function to remove map when component unmounts
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isLoading, hostel, isMapFullscreen]);

    // Effect to handle map resizing when fullscreen mode changes
    useEffect(() => {
        if (mapInstanceRef.current) {
            setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
            }, 200);
        }
    }, [isMapFullscreen]);

    const toggleMapFullscreen = () => {
        setIsMapFullscreen(!isMapFullscreen);
    };

    const handleShareLocation = () => {
        if (!hostel) return;

        if (navigator.share) {
            navigator.share({
                title: `${hostel.title} - ${hostel.city}`,
                text: `Check out this ${hostel.category} room in ${hostel.city}!`,
                url: window.location.href,
            });
        } else {
            // Fallback for browsers that don't support navigator.share
            const locationText = `${hostel.location.latitude},${hostel.location.longitude}`;
            navigator.clipboard.writeText(locationText);
            Swal.fire({
                icon: "success",
                title: "Copied!",
                text: "Location coordinates copied to clipboard!",
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    const handleBackClick = () => {
        window.history.back();
    };

    const openFullScreenImage = (index: number) => {
        setSelectedImageIndex(index);
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeFullScreenImage = () => {
        setSelectedImageIndex(null);
        // Re-enable body scrolling when modal is closed
        document.body.style.overflow = 'auto';
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        if (!hostel?.photos || selectedImageIndex === null) return;

        const totalImages = hostel.photos.length;
        if (direction === 'prev') {
            setSelectedImageIndex((selectedImageIndex - 1 + totalImages) % totalImages);
        } else {
            setSelectedImageIndex((selectedImageIndex + 1) % totalImages);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin h-10 w-10 border-4 border-orange-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold mt-4">Hostel not found</h2>
                    <p className="text-gray-600 mt-2">We couldn't find the hostel you're looking for. It may have been removed or the ID is incorrect.</p>
                    <button
                        onClick={handleBackClick}
                        className="mt-6 px-4 py-2 cursor-pointer bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-20 sm:pt-6 md:pt-8 lg:pt-12 xl:pt-16">
            {/* Header with back button */}
            <motion.div
                className="sticky top-0 z-10 bg-white shadow-sm p-4 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    onClick={handleBackClick}
                    className="mr-4 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">{hostel.title}</h1>
            </motion.div>

            {/* Main featured image */}
            <motion.div
                className="relative w-full h-64 md:h-96 bg-gray-200 overflow-hidden cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={() => (hostel.photos?.length > 0) && openFullScreenImage(0)}
            >
                {(hostel.photos ?? []).length > 0 ? (
                    <>
                        <img
                            src={hostel.photos[0]}
                            alt={hostel.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 py-1 px-3 rounded-full text-xs">
                            {hostel.photos.length} photos
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No photos available
                    </div>
                )}
            </motion.div>

            {/* Fullscreen map modal */}
            <AnimatePresence>
                {isMapFullscreen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="p-4 flex justify-between items-center">
                            <h3 className="text-white text-lg font-medium">
                                {hostel.title} - Location
                            </h3>
                            <button
                                onClick={toggleMapFullscreen}
                                className="text-white p-2 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div ref={isMapFullscreen ? mapRef : null} className="flex-1"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content */}
            <motion.div
                className="max-w-5xl mx-auto p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left column: Details */}
                    <div className="flex-1">
                        <motion.div
                            className="flex justify-between items-start border-b border-gray-300 pb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <div>
                                <h2 className="text-2xl font-semibold mb-1">{hostel.title}</h2>
                                <p className="text-gray-600">{hostel.city}</p>
                            </div>
                            <p className="text-2xl font-bold">Rs {hostel.rent.toLocaleString()}/month</p>
                        </motion.div>

                        <motion.div
                            className="py-6 border-b border-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            <h3 className="text-xl font-semibold mb-4">Hostel Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>

                                    <span>{hostel.capacity} {hostel.capacity > 1 ? 'persons' : 'person'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span>For {hostel.forWhom}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <span>{hostel.category} room</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span>Preferred: {hostel.genderPreference}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span>Contact: {hostel.mobileNo}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span>Listed {new Date(hostel.createdAt as string).toLocaleDateString()}</span>
                                </div>
                                {/* Food availability info */}
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <span>Food: {hostel.foodAvailability ? 'Available' : 'Not available'}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="py-6 border-b border-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        >
                            <h3 className="text-xl font-semibold mb-4">Description</h3>
                            <p className="text-gray-700">{hostel.description || "No description provided."}</p>
                        </motion.div>

                        {/* Enhanced Photo Gallery Grid */}
                        {(hostel.photos ?? []).length > 0 && (
                            <motion.div
                                className="py-6 border-b border-gray-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                            >
                                <h3 className="text-xl font-semibold mb-4">Photo Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {hostel.photos.map((photo, index) => (
                                        <div
                                            key={index}
                                            className={`
                                                overflow-hidden rounded-lg cursor-pointer bg-gray-200 shadow-sm hover:shadow-md transition-shadow
                                                ${index === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''}
                                                ${index === 0 ? 'h-64 md:h-80' : 'h-40'}
                                            `}
                                            onClick={() => openFullScreenImage(index)}
                                        >
                                            <img
                                                src={photo}
                                                alt={`${hostel.title} - photo ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Book now button - mobile only */}
                        <div className="md:hidden mt-6">
                            <button className="w-full py-3 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md">
                                Contact Host
                            </button>
                        </div>
                    </div>

                    {/* Right column: Map */}
                    <motion.div
                        className="md:w-96"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="sticky top-24 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                            {/* Map container with fullscreen button */}
                            <div className="relative">
                                <div ref={!isMapFullscreen ? mapRef : null} className="h-48 w-full"></div>
                                <button
                                    onClick={toggleMapFullscreen}
                                    className="absolute bottom-3 right-3 bg-white p-2 cursor-pointer rounded-full shadow-md hover:bg-gray-100 transition-colors z-1000"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="font-semibold">Rs {hostel.rent.toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">per month</p>
                                    </div>
                                    <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {hostel.category}
                                    </div>
                                </div>
                                <p className="font-semibold">Location</p>
                                <p className="text-sm text-gray-600 mb-2">{hostel.city}</p>
                                <p className="text-xs text-gray-500 mb-4">
                                    Coordinates: {hostel.location.latitude.toFixed(6)}, {hostel.location.longitude.toFixed(6)}
                                </p>
                                <button
                                    onClick={handleShareLocation}
                                    className="w-full py-2 mb-3 bg-white border cursor-pointer border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share Hostel
                                </button>
                                <button className="w-full py-3 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md hidden md:block">
                                    Contact Host
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Full screen image modal */}
            <AnimatePresence>
                {selectedImageIndex !== null && hostel.photos && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeFullScreenImage}
                    >
                        <motion.div
                            className="relative w-full h-full flex items-center justify-center"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Close button */}
                            <button
                                className="absolute top-4 right-4 text-white cursor-pointer p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeFullScreenImage();
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Navigation buttons */}
                            {hostel.photos.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateImage('prev');
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateImage('next');
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Image counter */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                                {selectedImageIndex + 1} / {hostel.photos.length}
                            </div>

                            {/* Image */}
                            <img
                                src={hostel.photos[selectedImageIndex]}
                                alt={`${hostel.title} - fullscreen view`}
                                className="max-h-full max-w-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}