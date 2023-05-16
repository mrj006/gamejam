import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor(private router: Router) {}

    handleError(error: any) {

        switch (error) {
            case "Invalid token specified: undefined is not an object (evaluating 'e.replace')":
            case "You must be properly signed in before submitting a game!":
                alert("You must be properly signed in before submitting a game!");
                this.router.navigate(['/']);
                break;
            
            case "You must be logged in to edit information!":
                alert("You must be logged in to edit information!");
                this.router.navigate(['/']);
                break;

            case "You have already created a game on this GameJam!":
                this.router.navigate(['/']);
                alert("You have already created a game on this GameJam!\nCheck your games in your profile.");
                break;
            
            case "You need to create a game first before adding its information!":
                this.router.navigate(['/']);
                alert("You need to create a game first before adding its information!");
                break;
            
            case "image size":
                alert("The maximum logo size is 5 MB! Choose a different image.");
                break;
            
            case "image dimensions":
                alert("The logo maximum dimensions are 400x400! Choose a different image.");
                break;

            default:
                alert("We are unable to load the page, try again later.");
        }

        console.log(error);
    }
}
