import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/Store.ts";
import {updateFormData} from "../reducers/HostelSlice.ts";
import {BedDouble, Home, Users, Utensils, UtensilsCrossed} from "lucide-react";
import {ChangeEvent, useEffect} from "react";
import {RoomCategories} from "../model/enum/RoomCategories.ts";

interface BasicInfoStepProps {
    updateNextState: (value: boolean) => void;
}

function BasicInfoStep({ updateNextState }: Readonly<BasicInfoStepProps>) {
    const dispatch = useDispatch();
    const { title, capacity, category, foodAvailability } = useSelector(
        (state: RootState) => state.hostel.formData
    );

    useEffect(() => {
        if (title.trim() && capacity > 0 && category && foodAvailability !== null) {
            updateNextState(true);
        } else {
            updateNextState(false);
        }
    }, [title, capacity, category, foodAvailability, updateNextState]);

    const handleCategorySelection = (selectedCategory: string) => {
        dispatch(updateFormData({ category: selectedCategory }));
    };

    const handleFoodSelection = (foodOption: boolean) => {
        dispatch(updateFormData({ foodAvailability: foodOption }));
    };

    const handleCapacityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^[0-9]+$/.test(value)) {
            dispatch(updateFormData({ capacity: Number(value) }));
        }
    };

    // Category options with appropriate icons
    const categoryOptions = [
        { label: "Single Room", value: RoomCategories.SINGLE, icon: <Home size={24} /> },
        { label: "Double Room", value: RoomCategories.DOUBLE, icon: <BedDouble size={24} /> },
        { label: "Sharing Room", value: RoomCategories.SHARING, icon: <Users size={24} /> },
    ];

    // Food options with appropriate icons
    const foodOptions = [
        { label: "Food Included", value: true, icon: <Utensils size={24} /> },
        { label: "No Food", value: false, icon: <UtensilsCrossed size={24} /> },
    ];

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-medium mb-8 text-gray-900">
                Start creating your listing
            </h2>

            {/* Title Input */}
            <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Listing name
                </label>
                <input
                    id="title"
                    type="text"
                    placeholder="Give your place a title"
                    value={title}
                    onChange={(e) => dispatch(updateFormData({ title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none"
                />
            </div>

            {/* Capacity Input */}
            <div className="mb-8">
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Guest capacity
                </label>
                <input
                    id="capacity"
                    type="number"
                    placeholder="How many guests can stay?"
                    value={capacity || ""}
                    onChange={handleCapacityChange}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none"
                />
            </div>

            {/* Category Selection */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Room type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {categoryOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleCategorySelection(option.value)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                                category === option.value
                                    ? "border-black bg-black/5 text-black"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <div className="mb-2">{option.icon}</div>
                            <span className="text-sm font-medium">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Food Availability */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Meal options</h3>
                <div className="grid grid-cols-2 gap-3">
                    {foodOptions.map((option) => (
                        <button
                            key={option.label}
                            onClick={() => handleFoodSelection(option.value)}
                            className={`flex flex-row items-center p-4 rounded-xl border transition-all duration-200 ${
                                foodAvailability === option.value
                                    ? "border-black bg-black/5 text-black"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <div className="mr-3">{option.icon}</div>
                            <span className="text-sm font-medium">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BasicInfoStep;