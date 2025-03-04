import {useEffect, useRef, useState} from "react";
import { House, Menu, Search, Utensils} from "lucide-react";
import logo from "../assets/image/logo/bordingspot.png";
import userIcon from "../assets/image/user.png"
import { Link, useNavigate } from "react-router-dom";
import SignUp from "../component/SignUp.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.ts";
import SignIn from "../component/SignIn.tsx";
import {logout} from "../reducers/UserSlice.ts";
function NavBar() {
    const [searchQuery, setSearchQuery] = useState({
        city: "",
        forWhom: "",
        genderPreference: "",
        foodAvailability: "",
        maxPrice: "",
    });
    const [activeTab, setActiveTab] = useState<"hostelries" | "foods">("hostelries");
    const isLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const userInitial = user && user.fullName ? user.fullName.charAt(0).toUpperCase() : "";
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutSide(event: MouseEvent){
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutSide);
        return () => document.removeEventListener('mousedown', handleClickOutSide);
    }, []);

    const handleSearch = () => {
        const queryParams = new URLSearchParams();

        if (activeTab === "hostelries") {
            if (searchQuery.city) queryParams.append("city", searchQuery.city);
            if (searchQuery.forWhom) queryParams.append("forWhom", searchQuery.forWhom);
            if (searchQuery.genderPreference) queryParams.append("genderPreference", searchQuery.genderPreference);
        } else if (activeTab === "foods") {
            if (searchQuery.city) queryParams.append("city", searchQuery.city);
            if (searchQuery.foodAvailability) queryParams.append("foodType", searchQuery.foodAvailability);
            if (searchQuery.maxPrice) queryParams.append("maxPrice", searchQuery.maxPrice);
        }

        navigate(`/${activeTab}?${queryParams.toString()}`);
    };


    return (
        <nav className="bg-white border-b border-gray-200 w-full">
            {/* Top Navbar */}
            <div className="flex justify-between items-center px-[4vw] py-4 ">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="Boardingspot" className="h-8" />
                    <div className="text-xl font-bold text-orange-600">Boardingspot</div>
                </div>

                {/* Navigation Links (Desktop) */}
                <div className="hidden md:flex text-gray-600 font-medium">
                    <Link to="/hostelries" onClick={() => setActiveTab("hostelries")}>
                        <button
                            className={`px-4 py-2 cursor-pointer rounded-full transition-all ${
                                activeTab === "hostelries"
                                    ? "text-gray-800 font-semibold"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            }`}
                        >
                            Hostelries
                        </button>
                    </Link>
                    <Link to="/foods" onClick={() => setActiveTab("foods")}>
                        <button
                            className={`px-4 py-2 rounded-full transition-all ${
                                activeTab === "foods"
                                    ? "text-gray-800 font-semibold"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            }`}
                        >
                            Foods
                        </button>
                    </Link>
                </div>

                {/* Right-Aligned Items */}
                <div
                    ref={dropdownRef}
                    className="flex items-center space-x-4">
                    <Link
                        to={ isLoggedIn? '/showcase-your-space' : "#"}
                        onClick={(e) => {
                            if (!isLoggedIn){
                                e.preventDefault();
                                setIsSignInOpen(true);
                                setIsDropdownOpen(false);
                            }
                        }}
                        className="hidden md:block bg-white text-sm px-4 py-3 rounded-full text-gray-700 font-semibold hover:bg-gray-100">
                        Showcase your space
                    </Link>

                    {/* User Menu */}
                    <div className="relative">
                        <div
                            className="flex items-center space-x-3 bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <Menu size={18} className="text-gray-600" />

                            {isLoggedIn ? (
                                <div className="w-8 h-8 flex items-center justify-center text-sm bg-gray-800 text-white font-medium rounded-full">
                                    {userInitial}
                                </div>
                            ) : (
                                <img src={userIcon} alt="User" className="h-8" />
                            )}
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className="absolute top-14 right-0 bg-white text-sm font-medium shadow-xl rounded-lg py-2 w-56 border border-gray-200 z-[999] transition-all"
                            >
                                {isLoggedIn ? (
                                    <>
                                        <Link
                                            to="/manage-listings"
                                            onClick={ () => setIsDropdownOpen(false)}
                                            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                                        >
                                            Manage Listings
                                        </Link>
                                        <Link
                                            to="/account"
                                            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                                        >
                                            Account
                                        </Link>
                                        <button
                                            className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                                            onClick={() => dispatch(logout())}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsSignInOpen(true)
                                                setIsDropdownOpen(false)
                                            }
                                            }
                                            className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsSignupOpen(true)
                                                setIsDropdownOpen(false)
                                            }
                                            }
                                            className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                                        >
                                            Sign Up
                                        </button>
                                        <Link
                                            to={isLoggedIn ? "/showcase-your-space" : "#"}
                                            onClick={(e) => {
                                                if (!isLoggedIn) {
                                                    e.preventDefault();
                                                    setIsDropdownOpen(false)
                                                    setIsSignInOpen(true)
                                                }
                                            }}
                                            className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                                        >
                                            Showcase Your Space
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-[4vw] pb-4">
                <div className="flex items-center bg-white rounded-full border border-gray-200 px-4 py-2 w-full max-w-4xl mx-auto drop-shadow-sm">
                    {activeTab === "hostelries" ? (
                        <>
                            {/* Hostelries Search Fields */}
                            <div className="flex-1 px-4 border-r border-gray-300">
                                <p className="text-xs font-semibold text-gray-700">Where</p>
                                <input
                                    type="text"
                                    placeholder="Search by city"
                                    value={searchQuery.city}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, city: e.target.value })}
                                    className="bg-transparent w-full text-sm text-gray-600 focus:outline-none"
                                />
                            </div>
                            <div className="flex-1 px-4 border-r border-gray-300 hidden md:block">
                                <p className="text-xs font-semibold text-gray-700">Occupation</p>
                                <input
                                    type="text"
                                    value={searchQuery.forWhom}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, forWhom: e.target.value })}
                                    placeholder="Tell us your occupation"
                                    className="bg-transparent w-full text-sm text-gray-600 focus:outline-none"
                                />
                            </div>
                            <div className="flex-1 px-4 hidden md:block">
                                <p className="text-xs font-semibold text-gray-700">Gender</p>
                                <input
                                    type="text"
                                    value={searchQuery.genderPreference}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, genderPreference: e.target.value })}
                                    placeholder="Search by gender"
                                    className="bg-transparent w-full text-sm text-gray-600 focus:outline-none"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Food Search Fields */}
                            <div className="flex-1 px-4 border-r border-gray-300">
                                <p className="text-xs font-semibold text-gray-700">Where</p>
                                <input
                                    type="text"
                                    value={searchQuery.city}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, city: e.target.value })}
                                    placeholder="Search by city"
                                    className="bg-transparent w-full text-sm text-gray-600 focus:outline-none"
                                />
                            </div>
                            <div className="flex-1 px-4 border-r border-gray-300 hidden md:block">
                                <p className="text-xs font-semibold text-gray-700">Food Type</p>
                                <input
                                    type="text"
                                    value={searchQuery.foodAvailability}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, foodAvailability: e.target.value })}
                                    placeholder="Breakfast, Lunch, Dinner?"
                                    className="bg-transparent w-full text-sm text-gray-600 focus:outline-none"
                                />
                            </div>
                            <div className="flex-1 px-4 hidden md:block">
                                <p className="text-xs font-semibold text-gray-700">Price Range</p>
                                <input
                                    type="text"
                                    value={searchQuery.maxPrice}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, maxPrice: e.target.value })}
                                    placeholder="Set your budget"
                                    className="bg-transparent w-full text-sm text-gray-600 focus:outline-none"
                                />
                            </div>
                        </>
                    )}

                    {/* Search Button */}
                    <button
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center px-5 py-4 rounded-full cursor-pointer transition-all duration-300 hover:from-orange-600 hover:to-red-600 active:from-orange-700 active:to-red-700"
                        onClick={handleSearch}
                    >
                        <Search size={18} className="mr-2" />
                        <span className="text-sm font-semibold">Search</span>
                    </button>
                </div>
            </div>

            <div className="md:hidden flex justify-between bg-white shadow-lg fixed bottom-0 w-full px-4 py-3 border-t border-gray-200">
                {/* Hostelries Tab */}
                <Link
                    to="/hostelries"
                    onClick={() => setActiveTab("hostelries")}
                    className="flex flex-col items-center cursor-pointer justify-center w-full text-center"
                >
                    <House
                        size={24}
                        className={`mb-1 ${activeTab === "hostelries" ? "text-orange-600" : "text-gray-600"}`}
                    />
                    <span
                        className={`text-xs ${activeTab === "hostelries" ? "text-orange-600 font-semibold" : "text-gray-600"}`}
                    >
            Hostelries
        </span>
                </Link>

                {/* Foods Tab */}
                <Link
                    to="/foods"
                    onClick={() => setActiveTab("foods")}
                    className="flex flex-col items-center cursor-pointer justify-center w-full text-center"
                >
                    <Utensils
                        size={24}
                        className={`mb-1 ${activeTab === "foods" ? "text-orange-600" : "text-gray-600"}`}
                    />
                    <span
                        className={`text-xs ${activeTab === "foods" ? "text-orange-600 font-semibold" : "text-gray-600"}`}
                    >
            Foods
        </span>
                </Link>
            </div>
            <SignUp isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
            <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        </nav>
    );
}

export default NavBar;
