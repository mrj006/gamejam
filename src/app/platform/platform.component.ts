import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-platform',
    templateUrl: './platform.component.html',
    styleUrls: ['../../styles.css']
})
export class PlatformComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
        
    }
}