import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    MapPin,
    Clock,
    Users,
    Eye,
    Edit2,
    Trash2,
    MoreHorizontal,
    CheckCircle
} from "lucide-react";
import Swal from "sweetalert2";
import {getTimeAgo} from "../util/util.ts";
import {deleteHostel} from "../reducers/HostelSlice.ts";
import {AppDispatch} from "../store/Store.ts";
import {IHostel} from "../types/types.ts";

interface ListingCardContainerProps {
    hostels: IHostel[];
    isLoading?: boolean;
}

const ListingCardContainer: React.FC<ListingCardContainerProps> = ({ hostels = [], isLoading = false }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleCardClick = (hostelId: string) => {
        navigate(`/hostel-details?id=${hostelId}`);
    };

    const handleEdit = (hostelId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/edit-listings?id=${hostelId}`);
    };

    const handleDelete = (hostelId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        Swal.fire({
            title: "Delete this listing?",
            text: "This action cannot be undone",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            reverseButtons: true,
            background: "#ffffff", // ✅ This is valid
        }).then(async (result) => {
            if (result.isConfirmed) {
                await dispatch(deleteHostel(hostelId));

                Swal.fire({
                    title: "Deleted",
                    text: "Your listing has been removed",
                    icon: "success",
                    confirmButtonColor: "#3B82F6",
                });
            }
        });
    };


    const toggleMenu = (hostelId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === hostelId ? null : hostelId);
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 p-4">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="animate-pulse rounded-xl overflow-hidden shadow-sm bg-white h-[400px]">
                        <div className="bg-gray-200 h-60"></div>
                        <div className="p-5 space-y-3">
                            <div className="h-5 bg-gray-200 rounded-full w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-1/3"></div>
                            <div className="flex gap-2 mt-4">
                                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            </div>
                            <div className="flex justify-between mt-3">
                                <div className="h-7 bg-gray-200 rounded-full w-1/3"></div>
                                <div className="h-7 bg-gray-200 rounded-full w-1/4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (hostels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <Edit2 className="text-blue-500 h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No listings yet</h3>
                <p className="text-gray-600 max-w-md mb-8">
                    You haven't published any properties. Create your first listing to start attracting guests.
                </p>
                <button
                    onClick={() => navigate('/create-hostel')}
                    className="px-6 py-3 bg-blue-600 text-white cursor-pointer font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                    <span>Create New Listing</span>
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hostels.map((hostel) => (
                    <div
                        key={hostel._id}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 relative group"
                        onClick={() => handleCardClick(hostel._id as string)}
                    >
                        <div className="relative">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src={hostel.photos[0] || "/placeholder.jpg"}
                                    alt={hostel.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                                <div className="p-4 w-full">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCardClick(hostel._id as string);
                                        }}
                                        className="bg-white cursor-pointer text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-md w-full justify-center"
                                    >
                                        <Eye className="h-4 w-4 text-blue-600" /> View Details
                                    </button>
                                </div>
                            </div>

                            {/* Status badge */}
                            <div className="absolute top-3 left-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full shadow-sm flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Active</span>
                            </div>

                            {/* Actions Menu */}
                            <div className="absolute top-3 right-3">
                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleMenu(hostel._id as string, e)}
                                        className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-colors shadow-sm"
                                        aria-label="More options"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>

                                    {activeMenu === hostel._id && (
                                        <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-xl overflow-hidden z-10 w-44 py-1 border border-gray-100 animate-fadeIn">
                                            <button
                                                onClick={(e) => handleEdit(hostel._id as string, e)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <Edit2 className="h-4 w-4 text-blue-600" /> Edit Listing
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(hostel._id as string, e)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" /> Delete Listing
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-800 leading-tight line-clamp-1 mb-1">
                                {hostel.title}
                            </h3>

                            <div className="flex items-center text-sm text-gray-600 mb-1">
                                <MapPin className="h-3.5 w-3.5 mr-1.5 text-blue-500" strokeWidth={2} />
                                <span className="truncate">{hostel.city}</span>
                            </div>

                            <div className="flex items-center text-xs text-gray-500 mb-3">
                                <Clock className="h-3 w-3 mr-1.5 text-gray-400" strokeWidth={2} />
                                <span>{getTimeAgo(hostel.createdAt as string)}</span>
                            </div>

                            <div className="border-t border-gray-100 pt-3 mt-1">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold text-lg text-gray-900">
                                        Rs {hostel.rent.toLocaleString()}
                                        <span className="text-xs font-normal text-gray-500 ml-1">/month</span>
                                    </p>
                                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {hostel.forWhom}
                  </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                    {hostel.genderPreference}
                  </span>
                                    <span className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                    {hostel.category}
                  </span>
                                    <span className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full flex items-center">
                    <Users className="h-3 w-3 mr-1 text-gray-400" strokeWidth={2} />
                                        {hostel.capacity} {hostel.capacity > 1 ? "persons" : "person"}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListingCardContainer;