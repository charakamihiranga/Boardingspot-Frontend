import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {RootState} from "../store/Store.ts";
import {useEffect, useState} from "react";
import {useMediaQuery} from "react-responsive";
import {addHostel, nextStep, prevStep, resetForm, updateFormData} from "../reducers/HostelSlice.ts";
import BasicInfoStep from "../component/BasicInfoStep.tsx";
import { motion } from "framer-motion";
import DotsLoader from "../component/DotsLoader.tsx";
import SignIn from "../component/SignIn.tsx";
import LocationInfoStep from "../component/LocationInfoStep.tsx";
import PreferenceStep from "../component/PreferenceStep.tsx";
import RoomDetailInfo from "../component/RoomDetailInfo.tsx";
import Swal from "sweetalert2";

function AddHostelPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const step = useSelector((state: RootState) => state.hostel.step);
    const hostel = useSelector((state: RootState) => state.hostel);
    const ownerDetail = useSelector((state: RootState) => state.user);
    const isLoading = useSelector((state: RootState) => state.hostel.isLoading);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const totalSteps = 4;
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [canProceed, setCanProceed] = useState(false);

    useEffect(() => {
        if (!ownerDetail.user._id) {
            setIsSignInOpen(true);
        } else {
            dispatch(updateFormData({ owner : ownerDetail.user._id}));
        }
    },[ownerDetail, dispatch])

    const updateNextButtonState = (isVisible: boolean) => {
        setCanProceed(isVisible);
    };

    const steps = [
        <BasicInfoStep updateNextState={updateNextButtonState} />,
        <LocationInfoStep updateNextState={updateNextButtonState} />,
        <PreferenceStep updateNextState={updateNextButtonState} />,
        <RoomDetailInfo updateNextState={updateNextButtonState} />
    ];

    const handlePublish = async () => {
        try {
            // @ts-ignore
            await dispatch(addHostel(hostel.formData));
            dispatch(resetForm());
            navigate("/");

            await Swal.fire({
                title: "Success!",
                text: "Hostel added successfully.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6",
            });
        } catch (error) {
            console.error("Failed to save hostel:", error);

            Swal.fire({
                title: "Error",
                text: "Failed to save hostel. Please try again.",
                icon: "error",
                confirmButtonText: "Retry",
                confirmButtonColor: "#d33",
            });
        }
    };



    return (
        <div className="w-full h-[78vh] mt-[8vh] px-[4vw] flex flex-col">
            <div className="flex-grow overflow-y-auto no-scrollbar py-2">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-white"
                >
                    {steps[step - 1]}
                </motion.div>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded-full mb-[2vh]">
                <motion.div
                    className="h-2 bg-black rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className={`w-full flex justify-between bg-white ${isMobile ? "mb-[6vh]" : ""}`}>
                {step > 1 && (
                    <button
                        onClick={() => dispatch(prevStep())}
                        className="px-6 py-3 cursor-pointer text-gray-700 rounded-lg hover:text-black underline transition"
                    >
                        Back
                    </button>
                )}
                {step < totalSteps ? (
                    <button
                        onClick={() => dispatch(nextStep())}
                        disabled={!canProceed}
                        className={`px-8 py-3 cursor-pointer rounded-lg shadow-md transition ml-auto ${
                            canProceed ? "bg-gray-900 text-white hover:bg-black" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handlePublish}
                        disabled={isLoading}
                        className={`px-8 py-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg shadow-md transition ${
                            isLoading ? "bg-orange-500 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                    >
                        {isLoading ? <DotsLoader /> : "Publish"}
                    </button>
                )}
            </div>

            <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        </div>
    );
}

export default AddHostelPage;