import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConnectionService } from '../services/connection';
import { Response } from '../services/response';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../../styles.css']
})
export class RegisterComponent implements OnInit {

    constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
        document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        document.getElementById("login")?.addEventListener('click', evt => {
            this.router.navigate(['/login']);
        });

        document.getElementById("register")?.addEventListener('click', evt => {
            this.register();
        });

        let skillsList = [
            "Angular",
            "AngularJS",
            "ASP.NET",
            "ASP.NET Core",
            "Bootstrap",
            "C",
            "Cassandra",
            "CSS",
            "C++",
            "C#",
            "Dart",
            "Django",
            "Express.js",
            "Flask",
            "GraphQL",
            "Go Lang",
            "HTML",
            "Java",
            "JavaScript",
            "Kotlin",
            "Laravel",
            "MariaDB",
            "Microsft SQL Server",
            "MongoDB",
            "MySQL",
            "Neo4J",
            "Next.js",
            "Node.js",
            "Objective-C",
            "PHP",
            "PowerShell",
            "Python",
            "R",
            "React",
            "Ruby",
            "Ruby on Rails",
            "Rust",
            "Shell",
            "SQL",
            "Swift",
            "TypeScript",
            "Vue.js",
            ".NET",
        ];

        let skiilsDatalist = document.createElement("datalist");
        skiilsDatalist.setAttribute("id", "skillsList");

        for (let skill of skillsList) {
            let option = document.createElement("option");
            option.setAttribute("value", skill);
            skiilsDatalist.appendChild(option);
        }

        document.getElementById("skillsLabel")?.appendChild(skiilsDatalist);

        document.getElementById("addSkillButton")?.addEventListener("click", evt => {
            this.addSkillInput();
        });

        let emailInput = document.getElementById("email") as HTMLInputElement;
        emailInput.setAttribute("pattern", environment.EMAIL_REGEX.source);
        emailInput.setAttribute("title", environment.EMAIL_ERROR);
        emailInput?.addEventListener("focusout", evt => {
            let pattern = new RegExp(environment.EMAIL_REGEX);
            
            if (emailInput?.value)
                if (!pattern.test(emailInput.value)) {
                    emailInput.style.borderColor = "#FF0000";
                    document.getElementById("emailError")?.style.setProperty("display", "block");
                } else {
                    emailInput.style.borderColor = "#ced4da";
                    document.getElementById("emailError")?.style.setProperty("display", "none");
                }
        });
        document.getElementById("emailError")?.appendChild(document.createTextNode(environment.EMAIL_ERROR));

        let passwordInput = document.getElementById("password") as HTMLInputElement;
        passwordInput.setAttribute("pattern", environment.PASS_REGEX.source);
        passwordInput.setAttribute("title", environment.PASS_ERROR);
        passwordInput?.addEventListener("focusout", evt => {
            let pattern = new RegExp(environment.PASS_REGEX);
            
            if (emailInput?.value)
                if (!pattern.test(passwordInput.value)) {
                    passwordInput.style.borderColor = "#FF0000";
                    document.getElementById("passError")?.style.setProperty("display", "block");
                } else {
                    passwordInput.style.borderColor = "#ced4da";
                    document.getElementById("passError")?.style.setProperty("display", "none");
                }
        });
        document.getElementById("passError")?.appendChild(document.createTextNode(environment.PASS_ERROR));

        let phoneInput = document.getElementById("phone") as HTMLInputElement;
        phoneInput.setAttribute("pattern", environment.PHONE_REGEX.source);
        phoneInput.setAttribute("title", environment.PHONE_ERROR);
        phoneInput?.addEventListener("focusout", evt => {
            let pattern = new RegExp(environment.PHONE_REGEX);
            
            if (phoneInput?.value)
                if (!pattern.test(phoneInput.value)) {
                    phoneInput.style.borderColor = "#FF0000";
                    document.getElementById("phoneError")?.style.setProperty("display", "block");
                } else {
                    phoneInput.style.borderColor = "#ced4da";
                    document.getElementById("phoneError")?.style.setProperty("display", "none");
                }
        });
        document.getElementById("phoneError")?.appendChild(document.createTextNode(environment.PHONE_ERROR));



        let  birthDateInput = document.getElementById("birthDate") as HTMLInputElement;
         birthDateInput?.addEventListener("focusout", evt => {
            let birthDate = new Date( birthDateInput.value);
            let age = (new Date()).getFullYear() - birthDate.getFullYear();
            
            if (age < 18)  {
                birthDateInput.style.borderColor = "#FF0000";
                document.getElementById("birthError")?.style.setProperty("display", "block");
            } else {
                birthDateInput.style.borderColor = "#ced4da";
                document.getElementById("birthError")?.style.setProperty("display", "none");
            }
        });
        document.getElementById("birthError")?.appendChild(document.createTextNode(environment.BIRTH_ERROR));
    }

    addSkillInput() {
        let div = document.createElement("div");
        div.setAttribute("class", "input-group mb-1 col-md-3");
        div.style.setProperty("margin-bottom", "1%");

        let skillDivID = this.randomString();
        div.setAttribute("id",skillDivID);

        let skillInput = document.createElement("input");
        skillInput.setAttribute("class", "form-control");
        skillInput.setAttribute("type", "text");
        skillInput.setAttribute("list", "skillsList");

        let deleteSkillButton = document.createElement("button");
        deleteSkillButton.setAttribute("class", "btn btn-warning");
        let deleteIcon = document.createElement("i");

        deleteIcon.setAttribute("class", "icon icon-m fa fa-trash");

        deleteSkillButton.appendChild(deleteIcon);
        //deleteSkillButton.style.setProperty("margin-left", "2%");
        deleteSkillButton.addEventListener("click", evt => {
            document.getElementById(skillDivID)?.remove();
        });

        div.appendChild(skillInput);
        div.appendChild(deleteSkillButton);
        div.appendChild(document.createElement("br"));

        let skillsDiv = document.getElementById("skillsDiv")
        skillsDiv?.appendChild(div);
    }

    randomString(): string {
        let string = "";
        let valid = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 32; i++) string += valid.charAt(Math.floor(Math.random() * valid.length));

        return string;
    }

    register() {
        let email = (document.getElementById("email") as HTMLInputElement)?.value;
        let name = (document.getElementById("name") as HTMLInputElement)?.value;
        let lastName = (document.getElementById("lastName") as HTMLInputElement)?.value;
        let username = (document.getElementById("username") as HTMLInputElement)?.value;
        let password = (document.getElementById("password") as HTMLInputElement)?.value;
        let discord = (document.getElementById("discord") as HTMLInputElement)?.value;
        let phone = (document.getElementById("phone") as HTMLInputElement)?.value;
        let birthDate = new Date((document.getElementById("birthDate") as HTMLInputElement)?.value);
        let identification = (document.getElementById("identification") as HTMLInputElement)?.value;
        let academicInstitution = (document.getElementById("academicInstitution") as HTMLInputElement)?.value;
        let medicalConditions = (document.getElementById("medicalConditions") as HTMLInputElement)?.value;
        let dietaryConditions = (document.getElementById("dietaryConditions") as HTMLInputElement)?.value;
        let hasParticipated = (document.getElementById("hasParticipated") as HTMLInputElement)?.checked;
        let gender = "";
        let shirtSize = (document.getElementById("shirtSize") as HTMLInputElement)?.value;
        let skills: string[] = [];
        let jobOpportunities = (document.getElementById("jobOpportunities") as HTMLInputElement)?.checked;
        let investments = (document.getElementById("investments") as HTMLInputElement)?.checked;

        document.getElementsByName("gender").forEach(option => {
            // as there'll be only 1 option checked, the loop could be broken by an exception
            // optimization not necessary for 4 options
            if ((option as HTMLInputElement).checked) gender = (option as HTMLInputElement).value;
        });

        document.getElementById("skillsDiv")?.childNodes.forEach(skill => {
            skills.push((skill.childNodes.item(0) as HTMLInputElement).value);
        });
        skills = Array.from((new Set(skills)).values());
        
        let user = {
            _id: email,
            name,
            lastName,
            username,
            password,
            discord,
            phone,
            birthDate,
            identification,
            academicInstitution,
            medicalConditions,
            dietaryConditions,
            hasParticipated,
            gender,
            shirtSize,
            skills,
            jobOpportunities,
            investments,
        }

        this.cs.registerUser(user).subscribe(res => {
            let response = res as Response;

            if ([400, 401].includes(response.code)) alert("Error: " + response.message);
            if (response.code == 403) alert("Error: " + response.message + "\nTry logging in instead.");
            if (response.code == 500) alert(response.message);
            if (response.code == 200) {
                if (response.token) {
                    let payload = jwtDecode(response.token) as Token;
                    let expiration = new Date(payload.exp);       
                    this.cookies.set("token", response.token, expiration);
                }
                this.router.navigate(['/']);
            }          
        });
    }
}
