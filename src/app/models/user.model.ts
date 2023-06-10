export interface User {
    _id: string; // email
    name: string;
    lastName: string;
    username: string;
    password: string;
    discord: string;
    phone: string;
    birthDate: Date;
    identification?: string;
    academicInstitution: string;
    medicalConditions?: string;
    dietaryConditions?: string;
    hasParticipated?: Boolean;
    gender: string;
    shirtSize?: string;
    skiils?: string[];
    jobOpportunities?: Boolean;
    investments?: Boolean;
    isGlobalOrg?: Boolean;
    localOrgs?: string[];
    jammers?: string[];
    mentors?: string[];
    judges?: string[];
    califications?: string[];
}