import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.ts";
import {getHostelById, updateFormData, updateHostel} from "../reducers/HostelSlice.ts";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Swal from "sweetalert2";
import {BedDouble, ChevronDown, ChevronUp, DollarSign, Home, Phone, Save, Users} from "lucide-react";import {GiMeal} from "react-icons/gi";
import {FaFemale, FaMale, FaUserFriends} from "react-icons/fa";
import {MdPeople, MdSchool, MdWork} from "react-icons/md";
import {useMediaQuery} from "react-responsive";
import {RoomCategories} from "../model/enum/RoomCategories.ts";
import {Gender} from "../model/enum/Gender.ts";
import {ResidentType} from "../model/enum/ResidentType.ts";

function UpdateHostel() {
    const [searchParams] = useSearchParams();
    const hostelId = searchParams.get("id");
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const selectedBoarding = useSelector((state: RootState) => state.hostel.selectedHostel);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState("basic");
    const navigation = useNavigate();

    const {
        title,
        capacity,
        category,
        foodAvailability,
        genderPreference,
        forWhom,
        description,
        mobileNo,
        rent,
        photos,
        city
    } = useSelector((state: RootState) => state.hostel.formData);

    // Fetch boarding data when component mounts
    useEffect(() => {
        if (hostelId) {
            setIsLoading(true);
            dispatch(getHostelById(hostelId))
                .finally(() => {
                    setTimeout(() => setIsLoading(false), 500);
                });
        }
    }, [dispatch, hostelId]);

    // Update form data when selected boarding changes
    useEffect(() => {
        if (selectedBoarding) {
            dispatch(updateFormData({
                title: selectedBoarding.title,
                capacity: selectedBoarding.capacity,
                category: selectedBoarding.category,
                foodAvailability: selectedBoarding.foodAvailability,
                genderPreference: selectedBoarding.genderPreference,
                forWhom: selectedBoarding.forWhom,
                description: selectedBoarding.description,
                mobileNo: selectedBoarding.mobileNo,
                rent: selectedBoarding.rent,
                photos: selectedBoarding.photos || [],
                city: selectedBoarding.city
            }));
        }
    }, [selectedBoarding, dispatch]);

    const handleInputChange = (field: string, value: string | number | boolean) => {
        dispatch(updateFormData({ [field]: value }));
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? "" : section);
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validation
        if (!title || !description || !mobileNo || !rent) {
            await Swal.fire({
                title: "Missing Information",
                text: "Please fill all required fields",
                icon: "error",
                confirmButtonColor: "#FF8A00",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await dispatch(updateHostel({
                id: hostelId || searchParams.get("id") as string,
                updates: {
                    title,
                    capacity,
                    category,
                    foodAvailability,
                    genderPreference,
                    forWhom,
                    description,
                    mobileNo,
                    rent,
                    photos,
                    city,
                },
            }));

            await Swal.fire({
                title: "Updated Successfully",
                text: "Your hostel details have been updated",
                icon: "success",
                confirmButtonColor: "#FF8A00",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "Update Failed",
                text: error.message as string || "Something went wrong",
                icon: "error",
                confirmButtonColor: "#FF8A00",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-orange-500 rounded-full"></div>
            </div>
        );
    }

    const progressPercentage = () => {
        const fields = [title, description, mobileNo, rent, capacity, category, genderPreference, forWhom];
        const filledFields = fields.filter(field => field !== undefined && field !== "").length;
        return Math.round((filledFields / fields.length) * 100);
    };

    return (
        <div className="bg-white min-h-screen pt-20 sm:pt-6  md:pt-8 lg:pt-12 xl:pt-16">
            <div className="sticky top-0 z-10 bg-white">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Your Listing</h1>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 transition-all duration-500"
                                style={{ width: `${progressPercentage()}%` }}
                            ></div>
                        </div>
                        <span className="text-sm text-gray-500">{progressPercentage()}% complete</span>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Basic Information */}
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-500 overflow-hidden">
                    <div
                        className="flex justify-between items-center p-6 cursor-pointer"
                        onClick={() => toggleSection("basic")}
                    >
                        <div className="flex items-center gap-3">
                            <Home className="w-6 h-6 text-orange-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                        </div>
                        {activeSection === "basic" ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                    </div>

                    {activeSection === "basic" && (
                        <div className="px-6 pb-6 space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Title <span className="text-orange-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 transition"
                                    placeholder="Create a catchy title for your place"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Description <span className="text-orange-500">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 transition"
                                    placeholder="Share what makes your place special"
                                    rows={5}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Contact Number <span className="text-orange-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={mobileNo || ""}
                                            onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition"
                                            placeholder="Your contact number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Monthly Rent (Rs) <span className="text-orange-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            value={rent || ""}
                                            onChange={(e) => handleInputChange("rent", Number(e.target.value))}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition"
                                            placeholder="Enter rent amount"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Room Details */}
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-500 overflow-hidden">
                    <div
                        className="flex justify-between items-center p-6 cursor-pointer"
                        onClick={() => toggleSection("room")}
                    >
                        <div className="flex items-center gap-3">
                            <BedDouble className="w-6 h-6 text-orange-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Room Details</h2>
                        </div>
                        {activeSection === "room" ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                    </div>

                    {activeSection === "room" && (
                        <div className="px-6 pb-6 space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Room Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: RoomCategories.SINGLE, label: "Single", icon: <FaUserFriends className="w-6 h-6" /> },
                                        { value: RoomCategories.DOUBLE, label: "Double", icon: <BedDouble className="w-6 h-6" /> },
                                        { value: RoomCategories.SHARING, label: "Sharing", icon: <MdPeople className="w-6 h-6" /> }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleInputChange("category", option.value)}
                                            className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                                                category === option.value
                                                    ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30"
                                                    : "border-gray-300 hover:bg-gray-50"
                                            } transition-all`}
                                        >
                                            {option.icon}
                                            <span className="mt-2">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Capacity</label>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleInputChange("capacity", Math.max(1, (capacity || 1) - 1))}
                                        className="px-4 py-2 bg-gray-100 rounded-l-lg hover:bg-gray-200 transition border border-gray-300"
                                    >
                                        -
                                    </button>
                                    <div className="flex items-center px-4 py-2 border-t border-b border-gray-300">
                                        <Users className="w-5 h-5 text-gray-500 mr-2" />
                                        <span>{capacity || 1} {(capacity || 1) === 1 ? 'person' : 'people'}</span>
                                    </div>
                                    <button
                                        onClick={() => handleInputChange("capacity", (capacity || 1) + 1)}
                                        className="px-4 py-2 bg-gray-100 rounded-r-lg hover:bg-gray-200 transition border border-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Food Availability</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleInputChange("foodAvailability", true)}
                                        className={`flex items-center justify-center px-5 py-3 border  rounded-lg ${
                                            foodAvailability === true
                                                ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30"
                                                : "border-gray-300 hover:bg-gray-50"
                                        } transition-all flex-1`}
                                    >
                                        <GiMeal className="w-5 h-5 mr-2" />
                                        <span>Available</span>
                                    </button>
                                    <button
                                        onClick={() => handleInputChange("foodAvailability", false)}
                                        className={`flex items-center justify-center px-5 py-3 border rounded-lg ${
                                            foodAvailability === false
                                                ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30"
                                                : "border-gray-300 hover:bg-gray-50"
                                        } transition-all flex-1`}
                                    >
                                        <span>Not Available</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Guest Preferences */}
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-500 overflow-hidden">
                    <div
                        className="flex justify-between items-center p-6 cursor-pointer"
                        onClick={() => toggleSection("preferences")}
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-orange-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Guest Preferences</h2>
                        </div>
                        {activeSection === "preferences" ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                    </div>

                    {activeSection === "preferences" && (
                        <div className="px-6 pb-6 space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Gender Preference</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: Gender.MALE, label: "Male", icon: <FaMale className="w-6 h-6" /> },
                                        { value: Gender.FEMALE, label: "Female", icon: <FaFemale className="w-6 h-6" /> },
                                        { value: Gender.ANY, label: "Anyone", icon: <FaUserFriends className="w-6 h-6" /> }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleInputChange("genderPreference", option.value)}
                                            className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                                                genderPreference === option.value
                                                    ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30"
                                                    : "border-gray-300 hover:bg-gray-50"
                                            } transition-all`}
                                        >
                                            {option.icon}
                                            <span className="mt-2">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">For Whom</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: ResidentType.STUDENT, label: "Student", icon: <MdSchool className="w-6 h-6" /> },
                                        { value: ResidentType.EMPLOYEE, label: "Employee", icon: <MdWork className="w-6 h-6" /> },
                                        { value: ResidentType.ANYONE, label: "Anyone", icon: <FaUserFriends className="w-6 h-6" /> }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleInputChange("forWhom", option.value)}
                                            className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                                                forWhom === option.value
                                                    ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30"
                                                    : "border-gray-300 hover:bg-gray-50"
                                            } transition-all`}
                                        >
                                            {option.icon}
                                            <span className="mt-2">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={`fixed bottom-0 left-0 right-0 z-10 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 ${
                        isMobile ? "mb-[6vh]" : ""
                    } px-6 sm:px-8`}
                >
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Back Button */}
                        <button
                            onClick={() => navigation("/manage-listings")}
                            className="flex items-center gap-2 px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 shadow-md hover:shadow-lg transition-all w-full sm:w-auto sm:min-w-[120px] justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-auto sm:min-w-[200px] justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UpdateHostel;