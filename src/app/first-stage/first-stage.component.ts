import { Component } from '@angular/core';
import { ConnectionService } from '../connection/connection';
import { Response } from '../connection/response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-stage',
  templateUrl: './first-stage.component.html',
  styleUrls: ['../../styles.css'],
})
export class FirstStageComponent {
  constructor(private cs: ConnectionService, router: Router) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    let skillsList = [
      'Angular',
      'AngularJS',
      'ASP.NET',
      'ASP.NET Core',
      'Bootstrap',
      'C',
      'Cassandra',
      'CSS',
      'C++',
      'C#',
      'Dart',
      'Django',
      'Express.js',
      'Flask',
      'GraphQL',
      'Go Lang',
      'HTML',
      'Java',
      'JavaScript',
      'Kotlin',
      'Laravel',
      'MariaDB',
      'Microsft SQL Server',
      'MongoDB',
      'MySQL',
      'Neo4J',
      'Next.js',
      'Node.js',
      'Objective-C',
      'PHP',
      'PowerShell',
      'Python',
      'R',
      'React',
      'Ruby',
      'Ruby on Rails',
      'Rust',
      'Shell',
      'SQL',
      'Swift',
      'TypeScript',
      'Vue.js',
      '.NET',
    ];

    let memberDatalist = document.createElement('datalist');
    memberDatalist.setAttribute('id', 'skillsList');

    for (let skill of skillsList) {
      let option = document.createElement('option');
      option.setAttribute('value', skill);
      memberDatalist.appendChild(option);
    }

    document.getElementById('skillsLabel')?.appendChild(memberDatalist);

    document
      .getElementById('addMembersButton')
      ?.addEventListener('click', (evt) => {
        this.addMembersButton();
      });

    document
      .getElementById('addSkillButton')
      ?.addEventListener('click', (evt) => {
        this.addMembersButton();
      });
  }
  fetchUser(username: string) {
    this.cs.findUser("d").subscribe(
      (res) => {
        console.log(res);
        // Procesa la respuesta aquí
      },
      (error) => {
        console.error(error);
        // Maneja el error aquí
      }
    );
  }
  addMembersButton() {
    let div = document.createElement('div');
    div.style.setProperty('margin-bottom', '1%');

    let memberDivID = crypto.randomUUID();
    div.setAttribute('id', memberDivID);

    let memberInput = document.createElement('input');
    memberInput.setAttribute('type', 'text');
    memberInput.setAttribute('list', 'skillsList');

    let deleteMemberButton = document.createElement('button');
    let deleteIcon = document.createElement('i');

    deleteIcon.setAttribute('class', 'icon icon-m fa fa-trash');

    deleteMemberButton.appendChild(deleteIcon);
    deleteMemberButton.style.setProperty('margin-left', '2%');
    deleteMemberButton.addEventListener('click', (evt) => {
      document.getElementById(memberDivID)?.remove();
    });

    div.appendChild(memberInput);
    div.appendChild(deleteMemberButton);
    div.appendChild(document.createElement('br'));

    let membersDiv = document.getElementById('membersDiv');
    membersDiv?.appendChild(div);
    this.fetchUser(memberInput.value);
  }
}
