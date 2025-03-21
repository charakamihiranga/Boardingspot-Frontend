import { Gender } from "../model/enum/Gender.ts";
import { RoomCategories } from "../model/enum/RoomCategories.ts";
import { ResidentType } from "../model/enum/ResidentType.ts";
import { Hostel } from "../model/Hostel.ts";

export const hostelValidators = {
    idRegex: /^[0-9a-fA-F]{24}$/,
    titleRegex: /^[a-zA-Z0-9\s.,'-]{3,100}$/,
    cityRegex: /^[a-zA-Z\s-]{2,50}$/,
    descriptionRegex: /^.{10,1000}$/s,
    capacityRegex: /^([1-9][0-9]{0,2}|1000)$/,
    rentRegex: /^([1-9][0-9]{0,6})(\.[0-9]{1,2})?$/,
    createdAtRegex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/,

    genderPreferenceValidator: (value: string): boolean =>
        Object.values(Gender).includes(value as Gender),

    categoryValidator: (value: string): boolean =>
        Object.values(RoomCategories).includes(value as RoomCategories),

    forWhomValidator: (value: string): boolean =>
        Object.values(ResidentType).includes(value as ResidentType),

    foodAvailabilityValidator: (value: any): boolean =>
        typeof value === 'boolean',

    validateHostel: (hostel: Partial<Hostel>): { isValid: boolean, errors: Record<string, string> } => {
        const errors: Record<string, string> = {};

        if (hostel._id && !hostelValidators.idRegex.test(hostel._id)) {
            errors._id = "The hostel ID appears to be invalid";
        }

        if (!hostel.title || !hostelValidators.titleRegex.test(hostel.title)) {
            errors.title = "Please enter a title between 3-100 characters";
        }

        if (!hostel.city || !hostelValidators.cityRegex.test(hostel.city)) {
            errors.city = "Please enter a valid city name";
        }

        if (!hostel.description || !hostelValidators.descriptionRegex.test(hostel.description)) {
            errors.description = "Description should be at least 10 characters";
        }

        if (!hostel.genderPreference || !hostelValidators.genderPreferenceValidator(hostel.genderPreference)) {
            errors.genderPreference = `Please select a valid gender preference`;
        }

        if (!hostel.capacity || !hostelValidators.capacityRegex.test(String(hostel.capacity))) {
            errors.capacity = "Please enter a valid capacity between 1-1000";
        }

        if (!hostel.category || !hostelValidators.categoryValidator(hostel.category)) {
            errors.category = `Please select a valid room category`;
        }

        if (!hostel.rent || !hostelValidators.rentRegex.test(String(hostel.rent))) {
            errors.rent = "Please enter a valid rent amount";
        }

        if (!hostel.mobileNo ) {
            errors.mobileNo = "Please enter a valid phone number";
        }

        if (!hostel.forWhom || !hostelValidators.forWhomValidator(hostel.forWhom)) {
            errors.forWhom = `Please select who the hostel is for`;
        }

        if (hostel.foodAvailability === undefined || !hostelValidators.foodAvailabilityValidator(hostel.foodAvailability)) {
            errors.foodAvailability = "Please specify if food is available";
        }

        if (hostel.createdAt && !hostelValidators.createdAtRegex.test(hostel.createdAt)) {
            errors.createdAt = "The date format appears to be invalid";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

export const validateAuthForm = (formData: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};

    if (!formData.email) {
        errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Invalid email format";
    }

    if (!formData.password) {
        errors.password = "Password is required";
    } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    if ("fullName" in formData && !formData.fullName.trim()) {
        errors.fullName = "Full Name is required";
    }

    if ("dob" in formData && !formData.dob) {
        errors.dob = "Date of Birth is required";
    }

    if ("gender" in formData && !formData.gender) {
        errors.gender = "Gender is required";
    }

    return errors;
};
