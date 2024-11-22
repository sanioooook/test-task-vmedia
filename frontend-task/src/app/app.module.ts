import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponent} from './app.component';
import {GroupsModule} from './modules/groups/groups.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    GroupsModule,
    CommonModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
