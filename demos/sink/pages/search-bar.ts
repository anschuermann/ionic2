import {Component, FormBuilder, Validators, ControlGroup} from 'angular2/angular2';

import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@Component({
  selector: 'ion-view',
  appInjector: [FormBuilder]
})
@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Search Bar</ion-title></ion-navbar>

  <ion-content padding>
    <h2>Search Bar</h2>
    <p>
      The Search Bar is a multi-function search component.
    </p>
    <p>
      The bar can sit standalone as part of a form or header search,
      or it can also handle and display a list of search results.
    </p>

    <form (submit)="doSubmit($event)" [ng-form-model]="form">
      <ion-search-bar placeholder="Search" ng-control="searchQuery"></ion-search-bar>
      <div>
        Query: <b>{{form.controls.searchQuery.value}}</b>
      </div>
    </form>
  </ion-content>
  `
})
export class SearchBarPage extends SinkPage {
  constructor(app: IonicApp, formBuilder: FormBuilder) {
    super(app);

    //var fb = new FormBuilder();
    this.form = formBuilder.group({
      searchQuery: ['', Validators.required]
    });
  }
}
