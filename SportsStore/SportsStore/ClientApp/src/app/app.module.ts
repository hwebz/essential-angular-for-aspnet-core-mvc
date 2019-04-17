import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ModelModule } from './models/model.module';
import { ProductTableComponent } from './structure/productTable.component';
import { CategoryFilterComponent } from './structure/categoryFilter.component';
import { ProductDetailComponent } from './structure/productDetail.component';
import { StoreModule } from './store/store.module';
import { ProductSelectionComponent } from './store/productSelection.component';


@NgModule({
  declarations: [
    AppComponent,
 //   NavMenuComponent,
	//HomeComponent,
	//ProductTableComponent,
	//CategoryFilterComponent,
	//ProductDetailComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
	HttpModule,
    FormsModule,
	  RouterModule.forRoot([
		//  { path: 'table', component: ProductTableComponent },
		//  { path: 'detail/:id', component: ProductDetailComponent },
		//  { path: 'detail', component: ProductDetailComponent },
		  //{ path: '', component: HomeComponent, pathMatch: 'full' }
		  { path: "store", component: ProductSelectionComponent },
		  { path: "", component: ProductSelectionComponent }
	  ]),
	  ModelModule,
	  StoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
