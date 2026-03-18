import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product';
import { ProductModel } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import JsBarcode from 'jsbarcode';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { QrcodeDialog } from '../../../../shared/components/qrcode-dialog/qrcode-dialog';

@Component({
  selector: 'app-product-list-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
})
export class ProductListPage {

  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  private search$ = new Subject<string>();
  private _products = signal<ProductModel[]>([]);
  products = this._products.asReadonly();
  productCode = "";
  loading = signal(false);

  ngOnInit() {
    this.loadProducts();
  }

  constructor(private dialog: MatDialog) {
    effect(() => {
      const list = this.products();
      queueMicrotask(() => this.generateBarcode(list));
    });

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(code => code.length >= 4),
        switchMap(code => this.productService.searchProduct(code)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => this._products.set(result));
  }

  generateBarcode(list: ProductModel[]) {
    list.forEach(product => {
      JsBarcode(`#barcode-${product.id}`, product.productCode, {
        format: "CODE39",
        width: 2,
        height: 50,
        displayValue: false
      });
    });
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(products => {
        this._products.set(products);
        this.loading.set(false);
      });
  }

  addProduct() {
    this.productService.createProduct()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadProducts());
  }

  deleteProduct(id: number, formattedProductCode: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        message: 'ต้องการลบข้อมูล รหัสสินค้า ' + formattedProductCode + ' หรือไม่ ?'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.productService.deleteProduct(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.loadProducts());
      }
    });
  }

  previewQrcode(id: number, productCode: string) {
    const dialogRef = this.dialog.open(QrcodeDialog, {
      data: {
        message: productCode
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.productService.deleteProduct(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.loadProducts());
      }
    });
  }

  onSearch() {
    if (!this.productCode || this.productCode.length < 4) {
      this.loadProducts();
      return;
    }
    this.search$.next(this.productCode);
  }
}
