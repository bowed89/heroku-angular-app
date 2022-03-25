import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OrdenService {
    constructor(public http: HttpClient) {}

    getAllOrdenes() {
        return this.http.get(`${URL_SERVICIOS}/orders`);
    }
    addOrdenTotal(object: Object): Observable<object> {
        return this.http.post(`${URL_SERVICIOS}/orders/newTotal`, object);
    }
    addOrdenDetalle(object: Object): Observable<object> {
        return this.http.post(`${URL_SERVICIOS}/orders/newDetail`, object);
    }
}
