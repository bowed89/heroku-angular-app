import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    constructor(public http: HttpClient) {}

    getAllClientes() {
        return this.http.get(`${URL_SERVICIOS}/clients`);
    }
    addCliente(object: Object): Observable<object> {
        return this.http.post(`${URL_SERVICIOS}/clients/new`, object);
    }
}
