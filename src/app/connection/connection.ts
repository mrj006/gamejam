import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Game } from '../models/game.model';
import { Response } from './response';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})

export class ConnectionService {
    private api = environment.BACKEND;
    private token = this.cookies.get("token");

    constructor(private http: HttpClient, private cookies: CookieService) {}

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

    public getUserGames(param: string) {
        return this.http.get<Response>(`${this.api}/getUserGames?user=${param}`);
    }

    public uploadFirstStage(game: Game) {
        return this.http.post<Response>(this.api + "/firstStage?token=" + this.token, game);
    }

    public uploadTeamInfo(form: FormData) {
        return this.http.post<Response>(this.api + "/teamInfo?token=" + this.token, form);
    }

    public uploadGameInfo(form: FormData) {
        return this.http.post<Response>(this.api + "/gameInfo?token=" + this.token, form);
    }
}
