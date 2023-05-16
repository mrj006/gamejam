import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../services/connection';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { Theme } from '../models/theme.model';
import { Category } from '../models/category.model';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { Game } from '../models/game.model';
import { Platform } from '../models/platform.model';
import { Genre } from '../models/genre.model';
import { Engine } from '../models/engine.model';

@Component({
    selector: 'app-game-info',
    templateUrl: './game-info.component.html',
    styleUrls: ['../../styles.css'],
})
export class GameInfoComponent implements OnInit {
    private token: string;
    private game?: Game;
    private logo?: File;

    constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {
        this.token = this.cookies.get("token");
    }

    ngOnInit(): void {
        this.init();
    }

    async init() {
        try {
            let payload = jwtDecode(this.token) as Token;

            if (!payload) {
                throw "You must be logged in to edit information!";
            }
            
            this.game = ((await firstValueFrom(this.cs.getCurrentUserGame(payload._id))).data as Game[])[0];

            if (!this.game) {
                throw "You need to create a game first before adding its information!";
            }

            document.getElementById("home")?.addEventListener('click', evt => {
                this.router.navigate(['/']);
            });

            let imageInput = document.getElementById("gameLogoInput") as HTMLInputElement;
            let gameLogo = document.getElementById("gameLogo") as HTMLImageElement;

            if (!(imageInput && gameLogo)) return;

            imageInput.setAttribute("accept", "image/jpeg,image/jpg,image/png");
            
            imageInput.onchange = (evt) => {
                let files = (evt.target as HTMLInputElement).files;

                if (!(files && this.game)) return;

                if (files[0].size / 1024**2 > 5) {
                    imageInput.value = "";
                    document.getElementById("gameLogoDiv")?.removeChild(gameLogo);
                    gameLogo = document.createElement("img");
                    gameLogo.setAttribute("id", "gameLogo");
                    document.getElementById("gameLogoDiv")?.appendChild(gameLogo);
                    throw "image size";
                }

                this.logo = new File([files[0]], this.game._id, {type: files[0].type});

                let fr = new FileReader();
                fr.onload = () => {
                    if (!fr.result) return;

                    gameLogo.src = fr.result?.toString();
                    
                    if (gameLogo.width > 400 || gameLogo.height > 400) {
                        imageInput.value = "";
                        
                        document.getElementById("gameLogoDiv")?.removeChild(gameLogo);
                        gameLogo = document.createElement("img");
                        gameLogo.setAttribute("id", "gameLogo");
                        document.getElementById("gameLogoDiv")?.appendChild(gameLogo);
                        throw "image dimensions";
                    }
                }
                fr.readAsDataURL(this.logo);
            }

            let themeList = (await firstValueFrom(this.cs.getCurrentThemes())).data as Theme[];
            
            let themesDiv = document.getElementById("themesDiv");

            for (let theme of themeList) {

                let div = document.createElement("div");
                div.setAttribute("class", "form-check");

                let input = document.createElement("input");
                input.setAttribute("class", "form-check-input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", theme._id);
                input.setAttribute("name", "themes");
                input.setAttribute("value", theme._id);

                let label = document.createElement("label");
                label.setAttribute("class", "form-check-label");
                label.setAttribute("for", theme._id);
                label.innerText = theme._id;

                div.appendChild(input);
                div.appendChild(label);
                themesDiv?.appendChild(div);
            }

            let categoryList = (await firstValueFrom(this.cs.getCurrentCategories())).data as Category[];
            let categoriesDiv = document.getElementById("categoriesDiv");

            for (let category of categoryList) {
                let div = document.createElement("div");
                div.setAttribute("class", "form-check");

                let input = document.createElement("input");
                input.setAttribute("class", "form-check-input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", category._id);
                input.setAttribute("name", "categories");
                input.setAttribute("value", category._id);

                let label = document.createElement("label");
                label.setAttribute("class", "form-check-label");
                label.setAttribute("for", category._id);
                label.innerText = category._id;

                div.appendChild(input);
                div.appendChild(label);
                categoriesDiv?.appendChild(div);
            }

            let platformList = (await firstValueFrom(this.cs.getPlatforms())).data as Platform[];
            let platformsDiv = document.getElementById("platformsDiv");

            for (let platform of platformList) {
                let div = document.createElement("div");
                div.setAttribute("class", "form-check");

                let input = document.createElement("input");
                input.setAttribute("class", "form-check-input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", platform._id);
                input.setAttribute("name", "platforms");
                input.setAttribute("value", platform._id);

                let label = document.createElement("label");
                label.setAttribute("class", "form-check-label");
                label.setAttribute("for", platform._id);
                label.innerText = platform._id;

                div.appendChild(input);
                div.appendChild(label);
                platformsDiv?.appendChild(div);
            }

            let genreList = (await firstValueFrom(this.cs.getGenres())).data as Genre[];
            let genreSelect = document.getElementById("genreSelect");

            for (let genre of genreList) {
                let option = document.createElement("option");
                option.value = genre._id;
                option.innerHTML = genre._id;

                genreSelect?.appendChild(option);
            }

            document.getElementById("addSelected")?.addEventListener("click", evt => {
                this.addGenres();
            });

            document.getElementById("deleteSelected")?.addEventListener("click", evt => {
                this.deleteGenres();
            });

            let engineList = (await firstValueFrom(this.cs.getEngines())).data as Engine[];
            let enginesDiv = document.getElementById("enginesDiv");

            for (let engine of engineList) {
                let div = document.createElement("div");
                div.setAttribute("class", "form-check");

                let input = document.createElement("input");
                input.setAttribute("class", "form-check-input");
                input.setAttribute("type", "radio");
                input.setAttribute("id", engine._id);
                input.setAttribute("name", "engines");
                input.setAttribute("value", engine._id);

                let label = document.createElement("label");
                label.setAttribute("class", "form-check-label");
                label.setAttribute("for", engine._id);
                label.innerText = engine._id;

                div.appendChild(input);
                div.appendChild(label);
                enginesDiv?.appendChild(div);
            }

            document.getElementById("back")?.addEventListener('click', evt => {
                this.router.navigate(['/']);
            });

            document.getElementById("save")?.addEventListener("click", evt => {
                this.upload();
            });
        } catch(e) {
            alert("We are unable to load the page, try again later.");
            this.router.navigate(['/']);
        }
    }

    addGenres(): void {
        let selectElement = document.getElementById('genreSelect') as HTMLSelectElement;
        let selectedOptions = Array.from(selectElement.selectedOptions);

        for (let option of selectedOptions) {
            let selected = option.cloneNode(true);
            document.getElementById("selectedGenres")?.appendChild(selected);
        }
    }
    deleteGenres(): void {
        let selectElement = document.getElementById('selectedGenres') as HTMLSelectElement;
        let selectedOptions = Array.from(selectElement.selectedOptions);

        for (let option of selectedOptions) {
            document.getElementById("selectedGenres")?.removeChild(option);
        }
    }

    upload() {
        let gameName = (document.getElementById('gameName') as HTMLInputElement)?.value;

        let description = (document.getElementById("description") as HTMLTextAreaElement)?.value;

        let themes: string[] = [];
        let themeOptions = document.querySelectorAll('input[name=themes]:checked');
        for (let i = 0; i < themeOptions.length; i++) {
            themes.push((themeOptions[i] as HTMLInputElement).value);
        }

        let categories: string[] = [];
        let categoryOptions = document.querySelectorAll('input[name=categories]:checked');
        for (let i = 0; i < categoryOptions.length; i++) {
            categories.push((categoryOptions[i] as HTMLInputElement).value);
        }

        let platforms: string[] = [];
        let platformsOptions = document.querySelectorAll('input[name=platforms]:checked');
        for (let i = 0; i < platformsOptions.length; i++) {
            platforms.push((platformsOptions[i] as HTMLInputElement).value);
        }

        let engine = "";

        document.getElementsByName("engines").forEach(option => {
            // as there'll be only 1 option checked, the loop could be broken by an exception
            // optimization not necessary for 4 options
            if ((option as HTMLInputElement).checked) engine = (option as HTMLInputElement).value;
        });

        let genres: string[] = [];
        (document.getElementById('selectedGenres') as HTMLSelectElement).childNodes.forEach(child => {
            genres.push((child as HTMLOptionElement).value);

        })

        let isForUnderAge = (document.getElementById("isForUnderAge") as HTMLInputElement)?.checked;

        if (!(this.game && this.logo)) {
            alert("You must provide a valid team logo to continue!");
            return;
        }
        
        let game: Partial<Game> = {
            gameName,
            description,
            isForUnderAge,
            themes,
            genres,
            categories,
            engine,
            platforms,
        };

        let form = new FormData();
        form.append("file", this.logo);
        form.append("_id", this.game._id);
        form.append("body", JSON.stringify(game))

        this.cs.uploadGameInfo(form, this.token).subscribe(response => {
            if (response.code == 500) alert(response.message);
            if (response.code == 200) {
                alert(response.message);
                this.router.navigate(['/']);
            }
            else alert('Error: ' + response.message);
        });
    }
}
