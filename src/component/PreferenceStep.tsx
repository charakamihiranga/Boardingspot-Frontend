import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/Store.ts";
import {updateFormData} from "../reducers/HostelSlice.ts";
import {FaFemale, FaMale, FaUser} from "react-icons/fa";
import {MdSchool, MdWork} from "react-icons/md";
import {useEffect} from "react";
import {Gender} from "../model/enum/Gender.ts";
import {ResidentType} from "../model/enum/ResidentType.ts";

interface PreferenceStepProps {
    updateNextState: (value: boolean) => void;
}

function PreferenceStep({ updateNextState }: Readonly<PreferenceStepProps>) {
    const dispatch = useDispatch();
    const { genderPreference, forWhom } = useSelector(
        (state: RootState) => state.hostel.formData
    );

    useEffect(() => {
        if (genderPreference && forWhom) {
            updateNextState(true);
        } else {
            updateNextState(false);
        }
    }, [genderPreference, forWhom, updateNextState]);

    const handleGenderSelection = (selectedGender: string) => {
        dispatch(updateFormData({ genderPreference: selectedGender }));
    };

    const handleForWhomSelection = (selectedForWhom: string) => {
        dispatch(updateFormData({ forWhom: selectedForWhom }));
    };

    return (
        <div className="w-full px-6 sm:px-[10vw] lg:px-[16vw]">
            <h2 className="text-2xl text-center font-medium mb-16">
                Help People Find the Perfect Stay – Set Your Preferences
            </h2>

            {/* Gender Preference */}
            <h2 className="text-xl text-center font-semibold mb-4">Gender Preference</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[90%] mx-auto">
                {[
                    { label: "Male", value: Gender.MALE, icon: <FaMale fontSize={50} className="text-gray-700" /> },
                    { label: "Female", value: Gender.FEMALE, icon: <FaFemale fontSize={50} className="text-gray-700" /> },
                    { label: "Anyone", value: Gender.ANY, icon: <FaUser fontSize={50} className="text-gray-700" /> },
                ].map((option) => (
                    <div
                        key={option.label}
                        className={`border border-gray-300 rounded-xl w-full h-[140px] sm:h-[160px] cursor-pointer flex flex-col items-center justify-center transition-all duration-200 ${
                            genderPreference === option.value ? "bg-gray-100 border-gray-700" : "bg-white"
                        } hover:shadow-md`}
                        onClick={() => handleGenderSelection(option.value)}
                    >
                        {option.icon}
                        <p className="font-semibold text-lg mt-2">{option.label}</p>
                    </div>
                ))}
            </div>

            {/* For Whom Selection */}
            <h2 className="text-xl text-center font-semibold mt-8 mb-4">For Whom?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[90%] mx-auto">
                {[
                    { label: "Student", value: ResidentType.STUDENT, icon: <MdSchool fontSize={50} className="text-gray-700" /> },
                    { label: "Employee", value: ResidentType.EMPLOYEE, icon: <MdWork fontSize={50} className="text-gray-700" /> },
                    { label: "Anyone", value: ResidentType.ANYONE, icon: <FaUser fontSize={50} className="text-gray-700" /> },
                ].map((option) => (
                    <div
                        key={option.label}
                        className={`border border-gray-300 rounded-xl w-full h-[140px] sm:h-[160px] cursor-pointer flex flex-col items-center justify-center transition-all duration-200 ${
                            forWhom === option.value ? "bg-gray-100 border-gray-700" : "bg-white"
                        } hover:shadow-md`}
                        onClick={() => handleForWhomSelection(option.value)}
                    >
                        {option.icon}
                        <p className="font-semibold text-lg mt-2">{option.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PreferenceStep;
