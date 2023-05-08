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
  users: any[] = []; // Agregar

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

    document.getElementById('searchBtn')?.addEventListener('click', (evt) => {
      let memberListDiv = document.getElementById('memberListDiv');
      if (memberListDiv) {
        memberListDiv.innerHTML = '';
      }

      let usernameInput = document.getElementById(
        'searchMember'
      ) as HTMLInputElement;
      this.fetchUser(usernameInput.value);
    });
  }
  fetchUser(username: string) {
    this.cs.findUser(username).subscribe(
      (res) => {
        let response = res as Response;
        // Procesa la respuesta aquí
        if (response.code === 200 && response.users) {
          this.users = response.users; // Actualizar el array de usuarios
          this.users.forEach((user: any) => {
            const email = user._id;
            const username = user.username;
            this.addMemberToList(username, email);
          });
        }
      },
      (error) => {
        console.error(error);
        // Maneja el error aquí
      }
    );
  }

  addMemberToList(username: string, email: string) {
    let memberListDiv = document.getElementById('memberListDiv');

    let memberDiv = document.createElement('div');
    memberDiv.style.display = 'flex';
    memberDiv.style.alignItems = 'center';
    memberDiv.style.justifyContent = 'space-between';
    memberDiv.style.padding = '8px 16px';
    memberDiv.style.border = '1px solid #ccc';
    memberDiv.style.borderRadius = '4px';
    memberDiv.style.marginBottom = '8px';
    memberDiv.style.backgroundColor = '#f9f9f9';

    let memberName = document.createElement('span');
    memberName.innerHTML = username;
    memberName.style.fontWeight = 'bold';
    memberName.style.marginRight = '16px';

    let memberEmail = document.createElement('span');
    memberEmail.innerHTML = email;
    memberEmail.style.color = '#777';

    memberDiv.appendChild(memberName);
    memberDiv.appendChild(memberEmail);

    memberListDiv?.appendChild(memberDiv);
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
