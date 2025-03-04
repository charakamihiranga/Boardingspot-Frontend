import {Gender} from "./enum/Gender.ts";

export class User {
    fullName: string;
    email: string;
    dob: Date;
    gender: Gender;
    profilePicture: string;
    password: string;

    constructor(fullName: string, email: string, dob: Date, gender: Gender, profilePicture: string, password: string) {
        this.fullName = fullName;
        this.email = email;
        this.dob = new Date(dob);
        this.gender = gender;
        this.profilePicture = profilePicture;
        this.password = password;
    }
}