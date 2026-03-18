import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.apiUrl);
  }

  createProduct(): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.apiUrl, {});
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchProduct(keyword: string) {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }
}
