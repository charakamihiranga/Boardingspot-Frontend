import { MapPin, Clock, Users, ArrowUpRight } from "lucide-react";
import { IHostelCardProps } from "../types/types.ts";
import {getTimeAgo} from "../util/util.ts";

export default function HostelCardGrid({ hostels, openHostelDetails }: IHostelCardProps) {


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {hostels.map((boarding) => (
                <div
                    key={boarding._id}
                    onClick={() => openHostelDetails(boarding._id)}
                    className="group rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col bg-white"
                >
                    {/* Image container with rounded corners */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl m-2">
                        <img
                            src={boarding.photos[0] || "/placeholder.jpg"}
                            alt={boarding.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-xl"
                        />

                        {/* Category and Gender badges */}
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            <span className="px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                                {boarding.category}
                            </span>
                            <span className="px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                                {boarding.genderPreference}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                        {/* Location and time */}
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center text-sm text-gray-700">
                                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="font-medium">{boarding.city}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {getTimeAgo(boarding.createdAt)}
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                            {boarding.title}
                        </h3>

                        {/* For whom tag */}
                        <span className="inline-block mb-2 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md w-fit">
                            {boarding.forWhom}
                        </span>

                        {/* Capacity */}
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{boarding.capacity} {boarding.capacity > 1 ? 'persons' : 'person'}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-100">
                            <div>
                                <p className="font-bold text-lg text-gray-900">
                                    Rs {boarding.rent.toLocaleString()}
                                    <span className="text-sm font-normal text-gray-500 ml-1">/month</span>
                                </p>
                            </div>

                            <div>
                                <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <ArrowUpRight className="h-4 w-4 text-gray-700" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}