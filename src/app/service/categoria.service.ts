import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CategoriaService {
    constructor(public http: HttpClient) {}

    getAllCategorias() {
        return this.http.get(`${URL_SERVICIOS}/categories`);
    }
   
}
