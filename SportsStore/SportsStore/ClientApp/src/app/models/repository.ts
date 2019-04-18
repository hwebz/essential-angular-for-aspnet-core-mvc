import { Product } from "./product.model"
import { Injectable } from "@angular/core";
import { Http, RequestMethod, Request, Response } from "@angular/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Filter, Pagination } from "./configClasses.repository";
import { Supplier } from "./supplier.model";
import { Order } from "./order.model";
import { ValidationError } from "../errorHandler.service";

const productsUrl = "/api/products";
const suppliersUrl = "/api/suppliers";
const sessionUrl = "/api/session";
const ordersUrl = "/api/orders";
const authUrl = "/api/account";

@Injectable()
export class Repository {
	private productsData: Product[] = [];
	private productData: Product;
	private filterObject = new Filter();
	private suppliersData: Supplier[] = [];
	private categoriesData: string[] = [];
	private paginationObject = new Pagination();
	private ordersData: Order[] = [];

	constructor(private http: Http) {
		//this.product = JSON.parse(document.getElementById("data").textContent);
		//this.filter.category = "soccer";
		this.filter.related = true;
		this.getProducts();
		this.getSuppliers();
		//this.getProduct(2);
	}

	getProduct(id: number) {
		this.sendRequest(RequestMethod.Get, productsUrl + "/" + id)
			.subscribe(response => this.productData = response);
	}

	getProducts() {
		let url = productsUrl + "?related=" + this.filter.related;

		if (this.filter.category) {
			url += "&category=" + this.filter.category;
		}

		url += "&metadata=true";

		this.sendRequest(RequestMethod.Get, url)
			.subscribe(response => {
				this.productsData = response.data;
				this.categoriesData = response.categories;
				this.paginationObject.currentPage = 1;
			});
	}

	getSuppliers() {
		this.sendRequest(RequestMethod.Get, suppliersUrl)
			.subscribe(response => this.suppliersData = response);
	}

	createProduct(prod: Product) {
		let data = {
			name: prod.name,
			category: prod.category,
			description: prod.description,
			price: prod.price,
			supplier: prod.supplier ? prod.supplier.supplierId : 0
		};

		this.sendRequest(RequestMethod.Post, productsUrl, data)
			.subscribe(response => {
				prod.productId = response;
				this.products.push(prod);
			});
	}

	createProductAndSupplier(prod: Product, supp: Supplier) {
		let data = {
			name: supp.name,
			city: supp.city,
			state: supp.state
		};

		this.sendRequest(RequestMethod.Post, suppliersUrl, data)
			.subscribe(response => {
				supp.supplierId = response;
				prod.supplier = supp;
				console.log(this);
				this.suppliersData.push(supp);
				if (prod != null) {
					this.createProduct(prod);
				}
			});
	}

	replaceProduct(prod: Product) {
		let data = {
			name: prod.name,
			category: prod.category,
			description: prod.description,
			price: prod.price,
			supplier: prod.supplier ? prod.supplier.supplierId : 0
		};
		this.sendRequest(RequestMethod.Put, productsUrl + "/" + prod.productId, data)
			.subscribe(response => this.getProducts());
	}

	replaceSupplier(supp: Supplier) {
		let data = {
			name: supp.name,
			city: supp.city,
			state: supp.state
		};
		this.sendRequest(RequestMethod.Put, suppliersUrl + "/" + supp.supplierId, data)
			.subscribe(response => this.getProducts());
	}

	updateProduct(id: number, changes: Map<string, any>) {
		let patch = [];
		changes.forEach((value, key) => patch.push({ op: "replace", path: key, value: value }));
		this.sendRequest(RequestMethod.Patch, productsUrl + "/" + id, patch).subscribe(response => this.getProducts());
	}

	deleteProduct(id: number) {
		this.sendRequest(RequestMethod.Delete, productsUrl + "/" + id)
			.subscribe(response => this.getProducts());
	}

	deleteSupplier(id: number) {
		this.sendRequest(RequestMethod.Delete, suppliersUrl + "/" + id)
			.subscribe(response => {
				this.getProducts();
				this.getSuppliers();
			});
	}

	// session data for cart
	storeSessionData(dataType: string, data: any) {
		return this.sendRequest(RequestMethod.Post, sessionUrl + "/" + dataType, data)
			.subscribe(response => { });
	}

	getSessionData(dataType: string): Observable<any> {
		return this.sendRequest(RequestMethod.Get, sessionUrl + "/" + dataType);
	}

	// orders
	getOrders() {
		this.sendRequest(RequestMethod.Get, ordersUrl)
			.subscribe(data => this.ordersData = data);
	}

	createOrder(order: Order) {
		this.sendRequest(RequestMethod.Post, ordersUrl, {
			name: order.name,
			address: order.address,
			payment: order.payment,
			products: order.products
		}).subscribe(data => {
			order.orderConfirmation = data;
			order.cart.clear();
			order.clear();
		})
	}

	shipOrder(order: Order) {
		this.sendRequest(RequestMethod.Post, ordersUrl + "/" + order.orderId)
			.subscribe(r => this.getOrders());
	}

	// authentication & authorization
	login(name: string, password: string): Observable<Response> {
		return this.http.post(authUrl + "/login", {
			name: name,
			password: password
		});
	}

	isLoggedIn(): Observable<Response> {
		return this.http.post(authUrl + "/loggedin", {});
	}

	logout() {
		this.http.post(authUrl + "/logout", null).subscribe(response => { });
	}

	private sendRequest(verb: RequestMethod, url: string, data?: any): Observable<any> {
		return this.http.request(new Request({
			method: verb,
			url: url,
			body: data
		})).pipe(map(response => response.headers.get("Content-Length") != "0" ? response.json() : null))
			.pipe(catchError((errorResponse: Response) => {
				if (errorResponse.status == 400) {
					let jsonData: string;
					try {
						jsonData = errorResponse.json();
					} catch (e) {
						throw new Error("Network Error");
					}
					let messages = Object.getOwnPropertyNames(jsonData).map(p => jsonData[p]);
					throw new ValidationError(messages);
				}
				throw new Error("Network Error");
		}));
	}

	get product(): Product {
		console.log("Product Data Requested");
		return this.productData;
	}

	get products(): Product[] {
		console.log("Products Requested");
		return this.productsData;
	}

	get filter(): Filter {
		return this.filterObject;
	}

	get suppliers(): Supplier[] {
		return this.suppliersData;
	}

	get categories(): string[] {
		return this.categoriesData;
	}

	get pagination(): Pagination {
		return this.paginationObject;
	}

	get orders(): Order[] {
		return this.ordersData;
	}

	set product(newProduct: Product) {
		this.productData = newProduct;
	}
}