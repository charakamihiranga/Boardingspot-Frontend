import { useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store.ts";
import { FaMapMarkedAlt } from "react-icons/fa";
import HostelCardGrid from "../component/HostelCardGrid.tsx";
import HostelCardSkeleton from "../component/HostelCardSkeleton.tsx";
import {Hostel} from "../model/Hostel.ts";
import {getHostels} from "../reducers/HostelSlice.ts";

function HostelriesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { hostels, isLoading, error } = useSelector((state: RootState) => state.hostel);
    const enableMT = location.pathname === "/";

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filters: Record<string, string> = {};
        params.forEach((value, key) => (filters[key] = value));
        dispatch(getHostels(filters) as any);
    }, [dispatch, location.search]);


    const navigateToHostelDetails = useCallback((hostelId: string) => {
        navigate(`/hostel-details?id=${hostelId}`);
    }, [navigate]);

    const mappedHostels = useMemo(() =>
            hostels.map((hostel: Partial<Hostel>) => new Hostel(hostel)),
        [hostels]);

    return (
        <div className={`relative ${enableMT ? "mt-[6vh]" : "mt-0"} px-[4vw] py-[4vh] no-scrollbar`}>

            {error && <p className="text-center text-red-500 py-8">Error: {error}</p>}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {Array.from({ length: 8 }, (_, index) => <HostelCardSkeleton key={index} />)}
                </div>
            ) : mappedHostels.length > 0 ? (
                <HostelCardGrid hostels={mappedHostels} openHostelDetails={navigateToHostelDetails} />
            ) : (
                <p className="text-center text-gray-500 py-8">No hostels available.</p>
            )}

            {/* Floating Map Button */}
            <button
                onClick={() => navigate("/hostelry-map")}
                className="fixed bottom-22 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-full px-6 py-4 flex items-center space-x-2
                cursor-pointer shadow-md hover:bg-black transition-all duration-300"
            >
                <FaMapMarkedAlt className="text-xl" />
                <span className="text-sm font-medium">Show Map</span>
            </button>
        </div>
    );
}

export default HostelriesPage;
