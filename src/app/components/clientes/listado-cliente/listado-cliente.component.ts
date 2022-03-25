import { Component, OnInit } from '@angular/core';

import { Product } from '../../../api/product';
import { Cliente } from '../../../api/cliente';
import { ProductService } from '../../../service/productservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClienteService } from '../../../service/cliente.service';

@Component({
    templateUrl: './listado-cliente.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../../assets/demo/badges.scss'],
})
export class ListadoClienteComponent implements OnInit {
    clientes: object;
    cliente: Cliente;

    productDialog: boolean;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[];

    product: Product;

    selectedProducts: Product[];

    submitted: boolean;

    cols: any[];

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private _clienteService: ClienteService,

        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this._clienteService.getAllClientes().subscribe((res) => {
            this.clientes = res;
        });
        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' },
        ];
    }

    openNew() {
        this.product = {};
        this.cliente = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
        this.selectedProducts = null;
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(
            (val) => val.id !== this.product.id
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveClient() {
        this.submitted = true;
        console.log('this.cliente=>', this.cliente)
         
        this._clienteService.addCliente(this.cliente).subscribe((res) => {
            console.log(res);
            this.messageService.add({
                severity: 'success',
                summary: 'Registro Satisfactorio',
                detail: 'Cliente registrado!',
                life: 1000,
            });
        });
        this.productDialog = false;

        setTimeout(() => {
            this._clienteService.getAllClientes().subscribe((res) => {
                this.clientes = res;
            });
        }, 1500);
     
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
