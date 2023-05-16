import { Component } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { Response } from '../services/response';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';
import { Venue } from '../models/venue.model';
import { firstValueFrom } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../services/token';

@Component({
    selector: 'app-first-stage',
    templateUrl: './first-stage.component.html',
    styleUrls: ['../../styles.css'],
})

export class FirstStageComponent {
    private token: string;
    constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {
        this.token = this.cookies.get('token');
    }

    ngOnInit(): void {
        this.init();
    }

    async init() {   
        let payload = jwtDecode(this.token) as Token;
        
        if (!payload) {
            throw "You must be properly signed in before submitting a game!";
        }

        let games = ((await firstValueFrom(this.cs.getCurrentUserGame(payload._id))).data as Game[])[0];
        
        if (games) {
            throw "You have already created a game on this GameJam!";
        }

        document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        let venueSelect = document.getElementById("venue");
        this.cs.getCurrentVenues().subscribe(res => {
            let venues = res.data as Venue[];

            for (let venue of venues) {
                let option = document.createElement("option");
                option.setAttribute("value", venue._id);
                option.innerHTML = venue.city + ", " + venue.country;

                venueSelect?.appendChild(option);
            }
        });

        document.getElementById('searchBtn')?.addEventListener('click', (evt) => {
            let memberResults = document.getElementById('memberResults');
            if (memberResults) {
                memberResults.innerHTML = '';
            }

            let usernameInput = document.getElementById('searchMember') as HTMLInputElement;
            this.searchUsers(usernameInput.value, "members");
        });

        document.getElementById('searchResponsibleBtn')?.addEventListener('click', async (evt) => {
            let responsibleResults = document.getElementById('responsibleResults');
            if (responsibleResults) {
                responsibleResults.innerHTML = '';
            }

            let usernameInput = document.getElementById('searchResponsible') as HTMLInputElement;
            this.searchUsers(usernameInput.value, "responsible");
        });

        // Add current user to members list
        let user = ((await firstValueFrom(this.cs.getUser(payload._id))).data as User[])[0];
        let members = document.getElementById('members');
        
        let elementDiv = document.createElement("div");
        elementDiv.setAttribute("id", user.username);
        elementDiv.setAttribute("class", "d-flex align-items-center justify-content-between p-2 mb-3 border rounded bg-light");

        let username = document.createElement('span');
        username.setAttribute("class", "fw-bold me-4");
        username.innerHTML = user.username;

        let email = document.createElement('span');
        email.setAttribute("class", "text-muted");
        email.innerText = user._id;
        
        elementDiv.appendChild(username);
        elementDiv.appendChild(email);
        elementDiv.appendChild(document.createElement("span"));
        members?.appendChild(elementDiv);


        document.getElementById('save')?.addEventListener('click', (evt) => {
            this.upload();
        });
    }

    async searchUsers(query: string, destination: string) {
        let response = await firstValueFrom(this.cs.findUser(query));
        let userResults = response.data as User[];
        if (!userResults) return;

        this.showResults(userResults, destination)
    } 
    
    async showResults(users: User[], destination: string) {
        let resultsDiv = destination == "responsible" ? document.getElementById('responsibleResults') : document.getElementById('memberResults');
        let listDiv = destination == "responsible" ? document.getElementById('responsible') : document.getElementById('members');

        mainloop:
        for (let user of users) {
            let children = listDiv?.children;
            if (children)
                for (let i = 0; i < children?.length; i++) {
                    let child = children[i];
                    
                    if (child.id === user.username) {
                        continue mainloop;
                    }
                }
    
            let resultDiv = document.createElement("div");
            resultDiv.setAttribute("id", user.username);
            resultDiv.setAttribute("class", "d-flex align-items-center justify-content-between p-2 mb-3 border rounded bg-light");
    
            let username = document.createElement('span');
            username.setAttribute("class", "fw-bold me-4");
            username.innerHTML = user.username;

            let email = document.createElement('span');
            email.setAttribute("class", "text-muted");
            email.innerText = user._id;

            let addButton = document.createElement('button');

            resultDiv.appendChild(username);
            resultDiv.appendChild(email);
            resultDiv.appendChild(addButton);

            addButton.setAttribute('class', 'btn btn-primary');
            addButton.setAttribute('type', 'button');
            addButton.innerHTML = '+';
            addButton.addEventListener('click', (evt) => {              
                let elementDiv = resultDiv.cloneNode() as HTMLDivElement;
                let elementUser = username.cloneNode(true) as HTMLSpanElement;
                let elementEmail = email.cloneNode(true) as HTMLSpanElement;
                let deleteButton = addButton.cloneNode() as HTMLButtonElement;
                deleteButton.innerHTML = "-";
                deleteButton.addEventListener("click", evt => {
                    listDiv?.removeChild(elementDiv);
                });

                (resultsDiv as HTMLDivElement).innerHTML = '';

                if (destination == "responsible") {
                    (listDiv as HTMLDivElement).innerHTML = '';
                    elementEmail.setAttribute("id", "responsibleUser");
                }

                elementDiv.appendChild(elementUser);
                elementDiv.appendChild(elementEmail);
                elementDiv.appendChild(deleteButton);
                listDiv?.appendChild(elementDiv);
            });
            
            resultsDiv?.appendChild(resultDiv);
        }
    }

    upload() {
        let teamName = (document.getElementById('teamName') as HTMLInputElement)?.value;
        let venue = (document.getElementById("venue") as HTMLInputElement)?.value;
        let responsible = document.getElementById("responsibleUser")?.innerHTML;
        let teamMembers: string[] = [];
        
        if (!responsible) {
            alert('Debe asignar un responsable al equipo');
            return;
        }

        document.getElementById("members")?.childNodes.forEach(div => {
            teamMembers.push((div.childNodes.item(1) as HTMLElement).innerHTML);
        })

        if (!teamMembers.includes(responsible)) teamMembers.push(responsible);
       
        if (!teamMembers) {
            alert('Debe agregar miembros al equipo');
            return;
        }

        let game: Partial<Game> = {
            teamName,
            venue,
            responsible,
            teamMembers,
        };

        this.cs.uploadFirstStage(game as Game, this.token).subscribe((res) => {
            let response = res as Response;
            if ([400, 401].includes(response.code)) alert('Error: ' + response.message);
            if (response.code == 403) alert('Error: ' + response.message);
            if (response.code == 500) alert(response.message);
            if (response.code == 200) {
                alert(response.message);
                this.router.navigate(['/']);
            }
        });
    }
}
