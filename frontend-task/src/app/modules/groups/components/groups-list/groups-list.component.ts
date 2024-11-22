import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Group} from '../../../../common/models/group';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrl: './groups-list.component.scss'
})
export class GroupsListComponent {
  @Input() allGroups: Group[] = [];
  @Input() selectedGroup: Group = null;
  @Output() selectGroup: EventEmitter<Group> = new EventEmitter();
  @Output() addGroup: EventEmitter<Group> = new EventEmitter();
  @Output() updateGroup: EventEmitter<Group> = new EventEmitter();
  @Output() deleteGroup: EventEmitter<Group> = new EventEmitter();

  constructor() {
  }

  addNewGroup() {
    const newGroupName = prompt("Type new group name");
    if(!newGroupName){
      return;
    }
    this.addGroup.emit({id: Date.now(), name: newGroupName, roles: []});
  }

  onEditGroup(group: Group) {
    const newGroupName = prompt('Type new group name', group.name);
    if (!newGroupName || newGroupName === group.name) {
      return;
    }
    this.updateGroup.emit({...group, name: newGroupName});
  }

  onDeleteGroup(group: Group) {
    if (confirm(`Are you sure to delete group with name ${group.name}?`)) {
      this.deleteGroup.emit(group);
    }
  }
}
