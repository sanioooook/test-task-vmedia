import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {GroupsComponent} from './components/groups.component';
import {GroupsListComponent} from './components/groups-list/groups-list.component';
import {RolesModule} from '../roles/roles.module';

@NgModule({
  declarations: [GroupsComponent, GroupsListComponent],
  imports: [
    CommonModule,
    RolesModule,
    NgOptimizedImage,
  ],
  exports: [GroupsComponent],
})
export class GroupsModule {
}
