import { Component, OnInit } from '@angular/core';

import { Product } from '../../../api/product';
import { OrdenTotal } from '../../../api/orden_total';
import { ProductService } from '../../../service/productservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductoService } from '../../../service/producto.service';
import { CategoriaService } from '../../../service/categoria.service';

@Component({
    templateUrl: './listado-productos.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../../assets/demo/badges.scss'],
})
export class ListadoProductosComponent implements OnInit {
    productos: object;
    orden: OrdenTotal;
    categorias: Array<any> = [];
    productDialog: boolean;
    precio: number;
    id_cat_prod: any;
    nombreProd: string;
    objEdit: object;

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
        private _productoService: ProductoService,
        private _categoriaService: CategoriaService,
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this._productoService.getAllProductos().subscribe((res) => {
            this.productos = res;
        });

        this._categoriaService.getAllCategorias().subscribe(res => {0
            for(let i in res) {
                this.categorias.push({
                    label: res[i].nombre, value: {id: res[i].id_cat_prod}
                })
            }
        })

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
        this.orden = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(idProd) {
        this.productDialog = true;
        var obj = {id: idProd}
        this._productoService.findProducto(obj).subscribe(res => {
            this.nombreProd = res[0].nombre
            this.precio = res[0].precio
            this.id_cat_prod = { id: res[0].id_cat_prod } 
        })
        this.objEdit = {
            producto: this.nombreProd,
            precio: this.precio,
            id_cat_prod: this.id_cat_prod
        }
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
        this.nombreProd = ''
        this.precio = null
    }

    saveProducto() {
        this.submitted = true;
        var objectProd = {
            id_cat_prod: this.id_cat_prod.id,
            nombre: this.nombreProd,
            precio: this.precio
        }
        console.log('objectProd', objectProd)
        this._productoService.addProducto(objectProd).subscribe(res => {
            this.messageService.add({severity: 'success', summary: 'Operación Exitosa', detail: 'Producto Creado Satisfactoriamente', life: 3000});
            // se vuelve a cargar la tabla de ordenes...
            setTimeout(() => {
                this._productoService.getAllProductos().subscribe((res) => {
                    this.productos = res;
                    this.hideDialog();
                });
            }, 1500);
        })
    }
}
