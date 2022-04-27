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
    arrayComida: Array<any> = [];
    arrayRifa: Array<any> = [];

    arrayComida2: Array<any> = [];
    arrayRifa2: any;
    ex: Array<any> = [];

    addOrden: Array<any> = [];

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
    ) { }

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
            this.prodCantArray[i].precio = this.prodCantArray[i]['prod']['precio']
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
        this.prodCantArray = [];
        this.addOrden = []
        this.arrayComida = [];
        this.arrayRifa = [];
    }

    saveClient() {
        var sumaCAntidad = 0;
        this.submitted = true;
        let objProdDet = {};


        for (let i in this.prodCantArray) {
            sumaCAntidad = sumaCAntidad + this.prodCantArray[i]['cantidad'];
        }
        //this.ordenTotal.id_cliente = this.ordenTotal.id_cliente['id_cliente'];
        this.ordenTotal.id_cliente = 3; // id_cliente estatico
        this.ordenTotal.id_usuario = 3;
        this.ordenTotal.cantidad = sumaCAntidad;
        console.log('this.ordenTotal', this.ordenTotal);
        console.log(this.prodCantArray);

        this._ordenService.addOrdenTotal(this.ordenTotal).subscribe(res => {
            console.log(res);

            for (let i in this.prodCantArray) {
                objProdDet = {
                    id_orden_total: res['res'].id_orden_total,
                    cantidad: this.prodCantArray[i]['cantidad'],
                    nombre_producto: this.prodCantArray[i]['prod']['nombre'],
                    precio: this.prodCantArray[i]['prod']['precio'],
                    total: this.prodCantArray[i]['total']
                };
                console.log(objProdDet);
                this._ordenService.addOrdenDetalle(objProdDet).subscribe(resp => {
                    this.addOrden.push(resp['res'])
                });
            }

            setTimeout(() => {
                let body;
                console.log(this.addOrden);
                for (let i in this.addOrden) {
                    console.log(this.addOrden[i].nombre_producto);
                    body = { 'nombre_producto': this.addOrden[i].nombre_producto }

                    this._productoService.getIdCatProd(body).subscribe(res => {
                        console.log('getIdCatProd', res);
                        // si es 10 es COMIDA
                        if (res[0]['id_cat_prod'] == 10) {
                            this.arrayComida.push({
                                nombre_producto: this.addOrden[i].nombre_producto,
                                id_orden_total: this.addOrden[i].id_orden_total,
                                cantidad: this.addOrden[i].cantidad
                            })

                        } else {
                            // si es otro es RIFA
                            this.arrayRifa.push({
                                nombre_producto: this.addOrden[i].nombre_producto,
                                id_orden_total: this.addOrden[i].id_orden_total,
                                cantidad: this.addOrden[i].cantidad
                            })
                        }
                    })
                }
                console.log(this.arrayComida);
                console.log(this.arrayRifa);
                this.pasarArrays(this.arrayComida, this.arrayRifa)

            }, 1000)
        });

        // se vuelve a cargar la tabla de ordenes...
        setTimeout(() => {
            this._ordenService
                .getAllOrdenes()
                .subscribe((res) => {
                    this.ordenes = res;
                    this.hideDialog();
                });
        }, 1500);

        this.messageService.add({
            severity: 'success',
            summary: 'Operación Exitosa',
            detail: 'Orden Creada Satisfactoriamente',
            life: 3000,
        });



    }



    pasarArrays(arrayC: Array<any>, arrayR: Array<any>) {
        console.log(arrayC);
        console.log(arrayR);

        setTimeout(() => {
            const setComida = () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(arrayC);
                    }, 2000);
                });
            }
            setComida().then((res: any) => {
                console.log(res);
                document.open();
                for (let i in res) {
                    document.write(`
                    <html>
                        <head>
                        <title>Print tab</title>
                        <style>
                        //........Customized style.......
                        </style>
                        </head>
                        <body onload="window.print();window.close()">
                            <p>ORDEN #: ${res[i].id_orden_total} </p> 
                            <p>TIPO: COMIDA</p>
                            <p>NOMBRE: ${res[i].nombre_producto} </p>
                            <p>CANTIDAD: ${res[i].cantidad} </p> 
                            ***************************
                            </body>
                    </html>
                    
                    `);
                }

                window.print();
                window.close();
            })
        }, 2000)


        setTimeout(() => {
            const setRifa = () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(arrayR);
                    }, 2000);
                });
            }
            setRifa().then((res: any) => {
                console.log(res);
                document.open();
                for (let i in res) {
                    document.write(`
                    <html>
                        <head>
                        <title>Print tab</title>
                        <style>
                        //........Customized style.......
                        </style>
                        </head>
                        <body onload="window.print();window.close()">
                            <p>ORDEN #: ${res[i].id_orden_total} </p> 
                            <p>TIPO: RIFA</p>
                            <p>NOMBRE: ${res[i].nombre_producto} </p>
                            <p>CANTIDAD: ${res[i].cantidad} </p> 
                            ***************************
                            </body>
                    </html>
                    
                    `);
                }
                window.print();
                window.close();
                window.location.reload()
            })
        }, 3000)
    }

    rescatar(a) {
        this.arrayComida2 = a
        console.log(this.arrayComida2);

        let printContents = document.getElementById('component1').innerHTML;
        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        window.close();
        document.body.innerHTML = originalContents;

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
}
