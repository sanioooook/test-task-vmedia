import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Role} from '../../../../common/models/role';
import {FilterRoles} from '../../../../common/models/filterRoles.enum';
import {KeyValue} from '@angular/common';
import {enumToArray} from '../../../../common/helpers/enumToKeyValueArray.helper';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss',
})
export class RolesListComponent {
  @Input() selectedGroupName: string = '';
  @Input() allRoles: Role[] = [];
  @Input() selectedRoles: Role[] = [];
  @Output() selectRole: EventEmitter<Role> = new EventEmitter();
  @Output() updateRole: EventEmitter<Role> = new EventEmitter();
  @Output() createdRole: EventEmitter<Role> = new EventEmitter();
  @Output() deletedRole: EventEmitter<Role> = new EventEmitter();

  searchRoles: string = '';
  selectedFilter: FilterRoles = FilterRoles.AllRoles;

  get roles(): Role[] {
    let roles: Role[] = [];
    switch (this.selectedFilter) {
      case FilterRoles.AllRoles:
        roles = this.allRoles;
        break;
      case FilterRoles.MarkedRoles:
        roles = this.selectedRoles;
        break;
      default:
        roles = this.allRoles;
    }
    if (this.searchRoles) {
      roles = roles.filter(x => x.name.toLowerCase().includes(this.searchRoles.toLowerCase()));
    }
    return roles;
  }

  filterRoles = enumToArray(FilterRoles);

  editRole(role: Role) {
    const newRoleName = prompt('Type new role name', role.name);
    if (!newRoleName || newRoleName === role.name) {
      return;
    }
    this.updateRole.emit({...role, name: newRoleName});
  }

  addNewRole() {
    const newRoleName = prompt('Type new group name');
    if (!newRoleName) {
      return;
    }
    this.createdRole.emit({id: Date.now(), name: newRoleName});
  }

  deleteRole(role: Role) {
    if (confirm(`Are you sure to delete role with name ${role.name}?`)) {
      this.deletedRole.emit(role);
    }
  }

  protected readonly FilterRoles = FilterRoles;
}
