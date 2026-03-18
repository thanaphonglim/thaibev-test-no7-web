import { Routes } from '@angular/router';
import { ProductListPage } from './features/product/pages/product-list-page/product-list-page';

export const routes: Routes = [
    {
        path: 'product-list',
        component: ProductListPage,
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: 'product-list',
        pathMatch: 'full',
    }
];
