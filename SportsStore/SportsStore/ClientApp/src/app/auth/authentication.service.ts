import { Injectable } from "@angular/core";
import { Repository } from "../models/repository";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class AuthenticationService {
	constructor(private repo: Repository, private router: Router) {}

	authenticated: boolean = false;
	name: string;
	password: string;
	callbackUrl: string;

	login(): Observable<boolean> {
		this.authenticated = false;
		return this.repo.login(this.name, this.password)
			.pipe(map(response => {
				if (response.ok) {
					this.authenticated = true;
					this.password = null;
					this.router.navigateByUrl(this.callbackUrl || "/admin/overview");
				}
				return this.authenticated;
			})).pipe(catchError(e => {
				this.authenticated = false;
				return of(false);
			}));
			
	}

	logout() {
		this.authenticated = false;
		this.repo.logout();
		this.router.navigateByUrl("/login");
	}
}