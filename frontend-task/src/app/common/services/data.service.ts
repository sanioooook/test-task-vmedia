import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Group} from '../models/group';
import {Role} from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {
  }

  getGroups(): Observable<Group[]> {
    const groupsInLocalstorage = localStorage.getItem('groups');
    if (!groupsInLocalstorage) {
      return of([]);
    }
    return of(JSON.parse(groupsInLocalstorage));
  }

  setGroups(groups: Group[]): void {
    localStorage.setItem('groups', JSON.stringify(groups));
  }

  getRoles(): Observable<Role[]> {
    const rolesInLocalstorage = localStorage.getItem('roles');
    if (!rolesInLocalstorage) {
      return of([]);
    }
    return of(JSON.parse(rolesInLocalstorage));
  }

  setRoles(roles: Role[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }
}
