import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AuthenticationComponent } from "./authentication.component";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationGuard } from "./authentication.guard";

@NgModule({
	imports: [RouterModule, FormsModule, BrowserModule],
	declarations: [AuthenticationComponent],
	providers: [AuthenticationService, AuthenticationGuard],
	exports: [AuthenticationComponent]
})

export class AuthModule { }