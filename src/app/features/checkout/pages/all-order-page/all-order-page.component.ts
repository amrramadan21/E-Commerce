import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { Stored_Keys } from '../../../../core/constants/stored-keys';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingDataSpinnerComponent } from '../../../../shared/components/loading-data-spinner/loading-data-spinner.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-all-orders-page',
  imports: [DatePipe, LoadingDataSpinnerComponent, PageHeaderComponent, RouterLink],
  templateUrl: './all-order-page.component.html',
  styleUrl: './all-order-page.component.css',
})
export class AllOrdersPageComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly platform = inject(PLATFORM_ID);
  isLoading = signal(false);
  allOrders = signal<any[]>([]);

  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders(): void {
    if (!isPlatformBrowser(this.platform)) return;
    const userId = localStorage.getItem(Stored_Keys.userId);
    if (!userId) return;
    this.isLoading.set(true);
    this.ordersService.getUserOrders(userId).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.allOrders.set(response);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  // helper methods (optional)
  getTotalItems(order: any): number {
    return order.cartItems.reduce((acc: number, item: any) => acc + item.count, 0);
  }
}