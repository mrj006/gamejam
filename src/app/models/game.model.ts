export interface Game {
    _id: string,
    teamName: string;
    venue: string;
    responsible: string;
    teamMembers: string[];
    teamLogo: string;
    teamExistence: number;
    aboutTeam: string;
    companyName: string;
    companyLink: string;
    gameName: string;
    description: string;
    gameLogo: string;
    isForUnderAge: boolean;
    themes: string[];
    genres: string[];
    categories: string[];
    engine: string;
    platforms: string[];
    gameFile: string;
    pitchLink: string;
    phase: number;
}
