import { useNavigate, useLocation } from "react-router-dom";
import { Users2, Briefcase, GraduationCap, Globe2, Sliders } from "lucide-react";
import { FaMale, FaFemale, FaUserFriends } from "react-icons/fa";
import { MdOutlineSingleBed, MdOutlineBedroomParent } from "react-icons/md";
import { useState, useEffect } from "react";

const categories = [
    { name: "Single", value: "single", key: "category", icon: MdOutlineSingleBed },
    { name: "Double", value: "double", key: "category", icon: Users2 },
    { name: "Sharing", value: "sharing", key: "category", icon: MdOutlineBedroomParent },
];

const occupations = [
    { name: "Student", value: "student", key: "forWhom", icon: GraduationCap },
    { name: "Employee", value: "employee", key: "forWhom", icon: Briefcase },
    { name: "Anyone", value: "anyone", key: "forWhom", icon: Globe2 },
];

const genders = [
    { name: "Male", value: "male", key: "genderPreference", icon: FaMale },
    { name: "Female", value: "female", key: "genderPreference", icon: FaFemale },
    { name: "Anyone", value: "anyone", key: "genderPreference", icon: FaUserFriends },
];

const filters = [...categories, ...occupations, ...genders];

function CategoryBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const [selectedFilter, setSelectedFilter] = useState<{ key: string | null; value: string | null }>({
        key: null,
        value: null,
    });

    useEffect(() => {
        for (const filter of filters) {
            if (params.get(filter.key)) {
                setSelectedFilter({ key: filter.key, value: params.get(filter.key) });
                break;
            }
        }
    }, [location.search]);

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams();
        if (selectedFilter.key === key && selectedFilter.value === value) {
            setSelectedFilter({ key: null, value: null });
        } else {
            newParams.set(key, value);
            setSelectedFilter({ key, value });
        }
        navigate(`?${newParams.toString()}`);
    };

    return (
        <div className="relative bg-white ">
            {/* Filter Button (Hidden on Mobile) */}
            <button className="absolute  right-2 hidden cursor-pointer sm:flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-700 hover:text-black hover:bg-gray-100 transition">
                <Sliders size={18} />
                <span className="text-sm font-medium">Filter</span>
            </button>

            {/* Category Bar - Scrollable on Mobile */}
            <div className="flex items-center gap-8 sm:gap-20 overflow-x-auto whitespace-nowrap no-scrollbar ">
                {filters.map((item) => {
                    const isActive = selectedFilter.key === item.key && selectedFilter.value === item.value;
                    return (
                        <button
                            key={`${item.key}-${item.value}`}
                            onClick={() => updateFilter(item.key, item.value)}
                            className={`flex flex-col text-xs items-center gap-1 rounded-lg transition-all cursor-pointer group ${
                                isActive ? "text-black font-semibold" : "text-gray-400"
                            } hover:text-black`}
                        >
                            <item.icon
                                size={24}
                                className={`transition-colors ${isActive ? "text-black" : "text-gray-400"} group-hover:text-black`}
                            />
                            <span className="whitespace-nowrap transition-colors group-hover:text-black">
                                {item.name}
                            </span>
                            {isActive && <div className="w-14 h-[2px] bg-black mt-1"></div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoryBar;
