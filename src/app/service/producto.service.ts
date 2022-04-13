import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductoService {
    constructor(public http: HttpClient) {}

    getAllProductos() {
        return this.http.get(`${URL_SERVICIOS}/products`);
    }
    getListProducts() {
        return this.http.get(`${URL_SERVICIOS}/products/list`);
    }
    addProducto(object: Object): Observable<object> {
        return this.http.post(`${URL_SERVICIOS}/products/new`, object);
    }
    findProducto(object: Object): Observable<object> {
        return this.http.post(`${URL_SERVICIOS}/products/find`, object);
    }
    getIdCatProd(body: object) {
        return this.http.post(`${URL_SERVICIOS}/products/idcatprod`, body);
    }
}
