import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Game } from '../models/game.model';
import { Response } from './response';

@Injectable({
    providedIn: 'root'
})

export class ConnectionService {
    private api = environment.BACKEND;

    constructor(private http: HttpClient) {}

    /////////////////////////////// USER ///////////////////////////////

    public registerUser(user: User) {
        return this.http.post(this.api + "/register", user);
    }

    public findUser(param: string) {
        return this.http.get<Response>(`${this.api}/findUsers?user=${param}`);
    }

    /////////////////////////////// GAME ///////////////////////////////

    public getCurrentCategories() {
        return this.http.get<Response>(this.api + "/currentCategories");
    }
    
    public getCurrentThemes() {
        return this.http.get<Response>(this.api + "/currentThemes");
    }

    public getCurrentVenues() {
        return this.http.get<Response>(this.api + "/currentVenues");
    }

    public getEngines() {
        return this.http.get<Response>(this.api + "/engines");
    }

    public getGenres() {
        return this.http.get<Response>(this.api + "/genres");
    }

    public getPlatforms() {
        return this.http.get<Response>(this.api + "/platforms");
    }

    public getUserGames(user: string) {
        return this.http.get<Response>(`${this.api}/getUserGames?user=${user}`);
    }

    public getUser(user: string) {
        return this.http.get<Response>(this.api + "/getUser?_id=" + user);
    }

    public getCurrentUserGame(user: string) {
        return this.http.get<Response>(this.api + "/getCurrentUserGame?_id=" + user);
    }

    public uploadFirstStage(game: Game, token: string) {
        return this.http.post<Response>(this.api + "/firstStage?token=" + token, game);
    }

    public uploadTeamInfo(form: FormData, token: string) {
        return this.http.post<Response>(this.api + "/teamInfo?token=" + token, form);
    }

    public uploadGameInfo(form: FormData, token: string) {
        return this.http.post<Response>(this.api + "/gameInfo?token=" + token, form);
    }
}