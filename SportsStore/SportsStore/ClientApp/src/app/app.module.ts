import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
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
import { CartDetailComponent } from './store/cartDetail.component';
import { CheckoutDetailsComponent } from './store/checkout/checkoutDetails.component';
import { CheckoutPaymentComponent } from './store/checkout/checkoutPayment.component';
import { CheckoutSummaryComponent } from './store/checkout/checkoutSummary.component';
import { OrderConfirmationComponent } from './store/checkout/orderConfirmation.component';
import { AdminModule } from './admin/admin.module';
import { AdminComponent } from './admin/admin.component';
import { ProductAdminComponent } from './admin/productAdmin.component';
import { OverviewComponent } from './admin/overview.component';
import { OrderAdminComponent } from './admin/orderAdmin.component';
import { ErrorHandlerService } from './errorHandler.service';
import { AuthModule } from './auth/auth.module';
import { AuthenticationGuard } from './auth/authentication.guard';
import { AuthenticationComponent } from './auth/authentication.component';

const eHandler = new ErrorHandlerService();

export function handler() {
	return eHandler;
}

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
		  { path: "login", component: AuthenticationComponent },
		  { path: "admin", redirectTo: "/admin/overview", pathMatch: "full" },
		  {
			  path: "admin", component: AdminComponent,
			  canActivateChild: [AuthenticationGuard],
			  children: [
				  { path: "products", component: ProductAdminComponent },
				  { path: "orders", component: OrderAdminComponent },
				  { path: "overview", component: OverviewComponent },
				  { path: "", component: OverviewComponent }
			  ]
		  },
		  { path: "checkout/step1", component: CheckoutDetailsComponent },
		  { path: "checkout/step2", component: CheckoutPaymentComponent },
		  { path: "checkout/step3", component: CheckoutSummaryComponent },
		  { path: "checkout/confirmation", component: OrderConfirmationComponent },
		  { path: "checkout", component: CheckoutDetailsComponent },
		  { path: "cart", component: CartDetailComponent },
		  { path: "store", component: ProductSelectionComponent },
		  { path: "", component: ProductSelectionComponent },
	  ]),
	  ModelModule,
	  StoreModule,
	  AdminModule,
	  AuthModule
  ],
	providers: [
		{ provide: ErrorHandlerService, useFactory: handler },
		{ provide: ErrorHandler, useFactory: handler }
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
