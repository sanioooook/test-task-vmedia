import {Component, OnDestroy, OnInit} from '@angular/core';
import {Role} from '../../../common/models/role';
import {Group} from '../../../common/models/group';
import {Subscription} from 'rxjs';
import {DataService} from '../../../common/services/data.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent implements OnInit, OnDestroy {
  allGroups: Group[] = [];
  allRoles: Role[] = [];
  selectedGroup: Group = null;

  private groupsSub$: Subscription | undefined;
  private rolesSub$: Subscription | undefined;

  get rolesBySelectedGroup(): Role[] {
    return this.allRoles.filter(x => this.selectedGroup.roles.includes(x.id));
  }

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.rolesSub$ = this.dataService.getRoles().subscribe(roles => this.allRoles = roles);
    this.groupsSub$ = this.dataService.getGroups().subscribe(groups => {
      this.allGroups = groups;
      this.selectedGroup = groups.length > 0 ? groups[0] : null;
    });
  }

  setGroups(groups: Group[]): void {
    this.dataService.setGroups(groups);
  }

  setRoles(roles: Role[]): void {
    this.dataService.setRoles(roles);
  }

  ngOnDestroy(): void {
    if(this.rolesSub$) {
      this.rolesSub$.unsubscribe();
    }
    if(this.groupsSub$) {
      this.groupsSub$.unsubscribe();
    }
  }

  addGroup(newGroup: Group) {
    this.allGroups = [...this.allGroups, newGroup];
    this.setGroups(this.allGroups);
  }

  deleteGroup(groupForDelete: Group) {
    this.allGroups = [...this.allGroups.filter(x => x.id !== groupForDelete.id)];
    if(this.selectedGroup.id === groupForDelete.id){
      this.selectedGroup = null;
    }
    this.setGroups(this.allGroups);
  }

  updateGroup(groupForUpdate: Group) {
    const index = this.allGroups.findIndex(x => x.id === groupForUpdate.id);
    if(index !== -1) {
      this.allGroups[index] = {...this.allGroups[index], ...groupForUpdate};
      this.setGroups(this.allGroups);
    }
  }

  createdRole(role: Role) {
    this.allRoles = [...this.allRoles, role];
    this.setRoles(this.allRoles);
  }

  deletedRole(role: Role) {
    const index = this.allRoles.findIndex(x => x.id === role.id);
    if(index !== -1) {
      this.allRoles = this.allRoles.splice(index, 1);
      this.setRoles(this.allRoles);
    }
  }

  updateRole(role: Role) {
    const index = this.allRoles.findIndex(x => x.id === role.id);
    if(index !== -1) {
      this.allRoles[index] = {...this.allRoles[index], ...role};
      this.setRoles(this.allRoles);
    }
  }

  selectRole(role: Role) {
    if(this.selectedGroup.roles.includes(role.id)) {
      this.selectedGroup.roles = this.selectedGroup.roles.filter(x => x !== role.id);
    } else {
      this.selectedGroup.roles = [...this.selectedGroup.roles, role.id];
    }
    const index = this.allGroups.findIndex(x => x.id === this.selectedGroup.id)
    if(index !== -1) {
      this.allGroups[index] = {...this.selectedGroup}
      this.setGroups(this.allGroups);
    }
  }
}
