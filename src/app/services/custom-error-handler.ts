import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor(private router: Router) {}

    handleError(error: any) {
        error = error.toString().toLowerCase();
        if (error.includes("Invalid token specified: undefined is not an object (evaluating 'e.replace')".toLowerCase()) || error.includes("You must be properly signed in before submitting a game!".toLowerCase())) {
            alert("You must be properly signed in before submitting a game!");
            this.router.navigate(['/']);
        } else if (error.includes("You must be logged in to edit information!".toLowerCase())) {
            alert("You must be logged in to edit information!");
            this.router.navigate(['/']);
        } else if (error.includes("You have already created a game on this GameJam!".toLowerCase())) {
            alert("You have already created a game on this GameJam!\nCheck your games in your profile.");
            this.router.navigate(['/']);
        } else if (error.includes("You need to create a game first before adding its information!".toLowerCase())) {
            alert("You need to create a game first before adding its information!");
            this.router.navigate(['/']);
        } else if (error.includes("image size")) {
            alert("The maximum logo size is 5 MB! Choose a different image.");
        } else if (error.includes("image dimensions")) {
            alert("The logo maximum dimensions are 400x400! Choose a different image.");
        } else {
            alert("We are unable to load the page, try again later.");
            this.router.navigate(['/']);
        }
        
        console.log(error);
    }
}
