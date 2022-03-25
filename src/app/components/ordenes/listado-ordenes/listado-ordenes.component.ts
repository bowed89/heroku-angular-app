import { Component, OnInit } from '@angular/core';

import { Product } from '../../../api/product';
import { OrdenTotal } from '../../../api/orden_total';
import { ProductService } from '../../../service/productservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdenService } from '../../../service/orden.service';
import { ProductoService } from '../../../service/producto.service';
import { ClienteService } from '../../../service/cliente.service';

@Component({
    templateUrl: './listado-ordenes.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../../assets/demo/badges.scss'],
})
export class ListadoOrdenesComponent implements OnInit {
    ordenes: object;
    listProd: object;
    filteredProducts: any[];
    listClients: object;
    filteredClients: any[];
    ordenTotal: OrdenTotal;
    flagCantidad: boolean = false;

    prodCantArray: Array<any> = [];
    newProdCant: any = {};

    productDialog: boolean;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[];

    product: Product;

    selectedProducts: Product[];

    submitted: boolean;

    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private _ordenService: OrdenService,
        private _productoService: ProductoService,
        private _clienteService: ClienteService,

        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this._productoService.getListProducts().subscribe((resp) => {
            this.listProd = resp;
        });

        this._clienteService.getAllClientes().subscribe((res) => {
            this.listClients = res;
            for (let i in res) {
                this.listClients[i]['nom_completo'] =
                    res[i].nombre + ' ' + res[i].apellido;
            }
        });

        this._ordenService.getAllOrdenes().subscribe((res) => {
            this.ordenes = res;
        });
        this.productService
            .getProducts()
            .then((data) => (this.products = data));
    }

    addFieldValueJ() {
        this.flagCantidad = false;
        var sumarTotal = 0;
        this.prodCantArray.push(this.newProdCant);
        console.log(this.prodCantArray);
        for (let i in this.prodCantArray) {
            // Multiplica cantidad X precio unitario y suma total
            this.prodCantArray[i].total =
                this.prodCantArray[i]['prod']['precio'] *
                this.prodCantArray[i]['cantidad'];
            sumarTotal = sumarTotal + this.prodCantArray[i].total;
            this.ordenTotal.total_pagar = sumarTotal;
            console.log('entraaa ==>', this.ordenTotal.total_pagar);
        }
        this.newProdCant = {};
    }

    changeFlagCant(e) {
        e !== null ? (this.flagCantidad = true) : (this.flagCantidad = false);
    }

    deleteFieldValueJ(index) {
        var sumarTotal = 0;
        this.prodCantArray.splice(index, 1);
        for (let i in this.prodCantArray) {
            //  suma total
            sumarTotal = sumarTotal + this.prodCantArray[i].total;
            this.ordenTotal.total_pagar = sumarTotal;
            console.log(
                ' this.ordenTotal.total_pagar',
                this.ordenTotal.total_pagar
            );
        }
        if (this.prodCantArray.length === 0) this.ordenTotal.total_pagar = 0;
    }

    cambioBs() {
        this.ordenTotal.cambio =
            this.ordenTotal.efectivo - this.ordenTotal.total_pagar;
    }

    openNew() {
        this.product = {};
        this.ordenTotal = {};
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
        this.prodCantArray = []
    }

    saveClient() {
        var sumaCAntidad = 0;
        this.submitted = true;
        var objProdDet = {}

        for (let i in this.prodCantArray) {
            sumaCAntidad = sumaCAntidad + this.prodCantArray[i]['cantidad'];
        }
        this.ordenTotal.id_cliente = this.ordenTotal.id_cliente['id_cliente'];
        this.ordenTotal.id_usuario = 3;
        this.ordenTotal.cantidad = sumaCAntidad;
        console.log(this.ordenTotal);
        console.log(this.prodCantArray);

        this._ordenService.addOrdenTotal(this.ordenTotal).subscribe(res => {
            console.log(res)
            for (let i in this.prodCantArray) {
                objProdDet = {
                    "id_orden_total": res['res'].id_orden_total,
                    "cantidad": this.prodCantArray[i]['cantidad'],
                    "nombre_producto": this.prodCantArray[i]['prod']['nombre'],
                    "precio": this.prodCantArray[i]['prod']['precio'],
                    "total": this.prodCantArray[i]['total'],
                    
                }
                console.log(objProdDet);
                this._ordenService.addOrdenDetalle(objProdDet).subscribe(resp => {
                    console.log(resp)
                    // se vuelve a cargar la tabla de ordenes...
                    setTimeout(() => {
                        this._ordenService.getAllOrdenes().subscribe((res) => {
                            this.ordenes = res;
                            this.hideDialog();
                        });
                    }, 1500);
                })
                this.messageService.add({severity: 'success', summary: 'Operación Exitosa', detail: 'Orden Creada Satisfactoriamente', life: 3000});
            }
        })
    }

    filterProducts(event) {
        const filtered: any[] = [];
        const query = event.query;
        console.log(query);
        console.log(event);
        for (let i = 0; i < Object.keys(this.listProd).length; i++) {
            const lista = this.listProd[i];
            if (lista.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(lista);
            }
        }
        this.filteredProducts = filtered;
    }

    filterClients(event) {
        const filtered: any[] = [];
        const query = event.query;
        console.log(query);
        console.log(event);
        for (let i = 0; i < Object.keys(this.listClients).length; i++) {
            const lista = this.listClients[i];
            if (lista.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(lista);
            }
        }
        this.filteredClients = filtered;
        if (this.filteredClients[0] !== undefined)
            this.ordenTotal.id_cliente = this.filteredClients[0].id_cliente;
        console.log('tthis.ordenTotal', this.ordenTotal);
    }

}
