import { Component } from '@angular/core';
import { ConnectionService } from '../connection/connection';
import { Response } from '../connection/response';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
@Component({
  selector: 'app-first-stage',
  templateUrl: './first-stage.component.html',
  styleUrls: ['../../styles.css'],
})
export class FirstStageComponent {
  constructor(private cs: ConnectionService, private router: Router) {}
  users: any[] = [];
  team: any[] = [];
  responsable: any = null;

  ngOnInit(): void {
    this.init();
  }

  init() {
    document.getElementById('searchBtn')?.addEventListener('click', (evt) => {
      let memberListDiv = document.getElementById('memberListDiv');
      if (memberListDiv) {
        memberListDiv.innerHTML = '';
      }

      let usernameInput = document.getElementById(
        'searchMember'
      ) as HTMLInputElement;
      this.fetchUser(usernameInput.value, this.addMemberToList);
    });

    document
      .getElementById('searchResponsableBtn')
      ?.addEventListener('click', (evt) => {
        let responsableListDiv = document.getElementById('responsableListDiv');
        if (responsableListDiv) {
          responsableListDiv.innerHTML = '';
        }

        let usernameInput = document.getElementById(
          'searchResponsable'
        ) as HTMLInputElement;
        this.fetchUser(usernameInput.value, this.addResponsable);
      });

    document.getElementById('save')?.addEventListener('click', (evt) => {
      this.upload();
    });
  }
  fetchUser(
    username: string,
    callback: (username: string, email: string) => void
  ) {
    this.cs.findUser(username).subscribe(
      (res) => {
        let response = res as Response;
        if (response.code === 200 && response.data) {
          this.users = response.data;
          this.users.forEach((user: any) => {
            const email = user._id;
            const username = user.username;
            callback.bind(this)(username, email);
          });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  addResponsable(username: string, email: string) {
    let responsableListDiv = document.getElementById('responsableListDiv');

    let responsableDiv = document.createElement('div');
    responsableDiv.classList.add(
      'd-flex',
      'align-items-center',
      'justify-content-between',
      'p-2',
      'mb-3',
      'border',
      'rounded',
      'bg-light'
    );

    let memberName = document.createElement('span');
    memberName.innerHTML = username;
    memberName.classList.add('fw-bold', 'me-4');

    let memberEmail = document.createElement('span');
    memberEmail.innerHTML = email;
    memberEmail.classList.add('text-muted');

    let addButton = document.createElement('button');
    addButton.classList.add('btn', 'btn-primary');
    addButton.setAttribute('type', 'button');
    addButton.innerHTML = '+';
    addButton.addEventListener('click', (evt) => {
      this.addRespondableToList(username, email);
    });

    responsableDiv.appendChild(memberName);
    responsableDiv.appendChild(memberEmail);
    responsableDiv.appendChild(addButton);

    responsableListDiv?.appendChild(responsableDiv);
  }

  addRespondableToList(username: string, email: string) {
    let responsableDiv = document.getElementById('ResponsableDivMember');
    if (responsableDiv) {
      responsableDiv.innerHTML = '';
    }

    this.responsable = { username, email };

    let responsibleMemberDiv = document.createElement('div');
    responsibleMemberDiv.classList.add(
      'd-flex',
      'align-items-center',
      'justify-content-between',
      'p-2',
      'mb-3',
      'border',
      'rounded',
      'bg-light'
    );

    let responsibleMemberName = document.createElement('span');
    responsibleMemberName.innerHTML = username;
    responsibleMemberName.classList.add('fw-bold', 'me-2');

    let responsibleMemberEmail = document.createElement('span');
    responsibleMemberEmail.innerHTML = email;
    responsibleMemberEmail.classList.add('text-muted', 'me-2');

    let deleteMemberButton = document.createElement('button');
    let deleteIcon = document.createElement('i');
    deleteIcon.setAttribute('class', 'icon icon-m fa fa-trash');
    deleteMemberButton.appendChild(deleteIcon);
    deleteMemberButton.setAttribute('type', 'button');
    deleteMemberButton.style.setProperty('margin-left', '2%');
    deleteMemberButton.addEventListener('click', (evt) => {
      this.responsable = null;
      responsableDiv?.removeChild(responsibleMemberDiv);
    });

    responsibleMemberDiv.appendChild(responsibleMemberName);
    responsibleMemberDiv.appendChild(responsibleMemberEmail);
    responsibleMemberDiv.appendChild(deleteMemberButton);

    responsableDiv?.appendChild(responsibleMemberDiv);
  }

  addMemberToList(username: string, email: string) {
    let memberListDiv = document.getElementById('memberListDiv');

    let memberDiv = document.createElement('div');
    memberDiv.classList.add(
      'd-flex',
      'align-items-center',
      'justify-content-between',
      'p-2',
      'mb-3',
      'border',
      'rounded',
      'bg-light'
    );

    let memberName = document.createElement('span');
    memberName.innerHTML = username;
    memberName.classList.add('fw-bold', 'me-4');

    let memberEmail = document.createElement('span');
    memberEmail.innerHTML = email;
    memberEmail.classList.add('text-muted');

    let addButton = document.createElement('button');
    addButton.classList.add('btn', 'btn-primary');
    addButton.setAttribute('type', 'button');
    addButton.innerHTML = '+';
    addButton.addEventListener('click', (evt) => {
      this.addMemberToTeam(username, email);
    });

    memberDiv.appendChild(memberName);
    memberDiv.appendChild(memberEmail);
    memberDiv.appendChild(addButton);

    memberListDiv?.appendChild(memberDiv);
  }
  addMemberToTeam(username: string, email: string) {
    this.team.push({ username, email });

    let teamListDiv = document.getElementById('teamListDiv');

    let teamMemberDiv = document.createElement('div');
    teamMemberDiv.classList.add(
      'd-flex',
      'align-items-center',
      'justify-content-between',
      'p-2',
      'mb-3',
      'border',
      'rounded',
      'bg-light'
    );

    let teamMemberName = document.createElement('span');
    teamMemberName.innerHTML = username;
    teamMemberName.classList.add('fw-bold', 'me-2');

    let teamMemberEmail = document.createElement('span');
    teamMemberEmail.innerHTML = email;
    teamMemberEmail.classList.add('text-muted', 'me-2');

    let deleteMemberButton = document.createElement('button');
    let deleteIcon = document.createElement('i');
    deleteIcon.setAttribute('class', 'icon icon-m fa fa-trash');
    deleteMemberButton.appendChild(deleteIcon);
    deleteMemberButton.setAttribute('type', 'button');
    deleteMemberButton.style.setProperty('margin-left', '2%');
    deleteMemberButton.addEventListener('click', (evt) => {
      this.team = this.team.filter(
        (member) => member.username !== username || member.email !== email
      );
      teamListDiv?.removeChild(teamMemberDiv);
    });

    teamMemberDiv.appendChild(teamMemberName);
    teamMemberDiv.appendChild(teamMemberEmail);
    teamMemberDiv.appendChild(deleteMemberButton);

    teamListDiv?.appendChild(teamMemberDiv);
  }

  upload() {
    let gameName = (document.getElementById('gameName') as HTMLInputElement)
      ?.value;
    let teamName = (document.getElementById('teamName') as HTMLInputElement)
      ?.value;

    if (!this.responsable) {
      alert('Debe asignar un responsable al equipo');
      return;
    }

    // Verificar si hay miembros en el equipo
    if (this.team.length === 0) {
      alert('Debe agregar miembros al equipo');
      return;
    }

    let responsible = this.responsable.email;

    let teamMembers: string[] = this.team.map((member) => member.email);
    let game: Partial<Game> = {
      gameName,
      teamName,
      responsible,
      teamMembers,
    };

    this.cs.uploadFirstStage(game as Game).subscribe((res) => {
      let response = res as Response;
      if ([400, 401].includes(response.code))
        alert('Error: ' + response.message);
      if (response.code == 403)
        alert('Error: ' + response.message + '\nTry logging in instead.');
      if (response.code == 500) alert(response.message);
      if (response.code == 200) {
        if (response.token) this.router.navigate(['/']);
      }
    });
  }
}
