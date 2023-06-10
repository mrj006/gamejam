export interface Venue {
    _id: string;
    city: string;
    country: string;
    gamejams: Date[];
    localOrgs?: string[];
    jammers?: string[];
    mentors?: string[];
    judges?: string[];
}