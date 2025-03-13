import { useDispatch, useSelector } from "react-redux";
import {useState, useRef, useEffect, ChangeEvent} from "react";
import { RootState } from "../store/Store.ts";
import { updateFormData } from "../reducers/HostelSlice.ts";
import { PlusCircle, Trash2 } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import Swal from "sweetalert2";

function RoomDetailInfo({ updateNextState }: { updateNextState: (value: boolean) => void }) {
    const dispatch = useDispatch();
    const { description, mobileNo, rent, photos } = useSelector((state: RootState) => state.hostel.formData);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>(photos || []);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        const isFormValid = description.trim() !== ""  && rent > 0 && previewImages.length > 0;
        updateNextState(isFormValid);
    }, [description, mobileNo, rent, previewImages, updateNextState]);

    const handleInputChange = (field: string, value: string | number) => {
        dispatch(updateFormData({ [field]: value }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            // Generate preview images and store actual files
            const newPreviews = filesArray.map((file) => URL.createObjectURL(file));

            if (previewImages.length + newPreviews.length > 5) {
                Swal.fire({
                    icon: "warning",
                    title: "Limit Exceeded",
                    text: "You can upload up to 5 images only.",
                    confirmButtonColor: "#f59e0b",
                });
                return;
            }

            setPreviewImages((prev) => [...prev, ...newPreviews]); // Store previews for UI
            dispatch(updateFormData({ photos: [...photos, ...filesArray] })); // Store actual files
        }
    };

    const handleAddImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = previewImages.filter((_, i) => i !== index);
        setPreviewImages(updatedImages);
        dispatch(updateFormData({ photos: updatedImages }));
    };

    return (
        <div className="w-full px-6 sm:px-[12vw]">
            <h2 className="text-2xl text-center font-medium mb-6">Help People Find Their Perfect Stay</h2>

            <div className="mb-4">
                <label className="block text-lg font-medium mb-1">Room Description</label>
                <textarea
                    value={description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 outline-none resize-none"
                    placeholder="Describe the room, facilities, and any special details..."
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-lg font-medium mb-1">Contact Number</label>
                    <input
                        type="tel"
                        value={mobileNo ? mobileNo : ""}
                        onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        placeholder="Enter mobile number"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-1">Monthly Rent (in Rs)</label>
                    <input
                        type="number"
                        onChange={(e) => handleInputChange("rent", Number(e.target.value))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        placeholder="Enter rent amount"
                    />
                </div>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-4">Upload Room Images</h3>
            <div className="w-full flex justify-center">
                <button
                    onClick={handleAddImageClick}
                    disabled={previewImages.length >= 5}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
                        previewImages.length < 5 ? "bg-gray-900 text-white hover:bg-black" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    <PlusCircle className="w-6 h-6" /> Add Images
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                />
            </div>

            {previewImages.length > 0 && (
                <div className="w-full flex justify-center mt-6">
                    <div className="flex flex-wrap justify-center gap-4">
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image}
                                    alt={`Preview ${index}`}
                                    className={`rounded-lg object-cover ${isMobile ? "w-36 h-36" : "w-44 h-44"}`}
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoomDetailInfo;
