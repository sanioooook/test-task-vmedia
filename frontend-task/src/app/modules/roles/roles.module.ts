import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RolesListComponent} from './components/roles-list/roles-list.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [RolesListComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage,
  ],
  exports: [RolesListComponent],
})
export class RolesModule {
}
