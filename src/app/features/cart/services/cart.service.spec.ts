import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartService, ICartResponse } from './cart.service';
import { firstValueFrom } from 'rxjs';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Guest Cart Fallback (Offline Mode)', () => {
    it('should initially have 0 items in cart', () => {
      expect(service.numOfCartItems()).toBe(0);
      expect(service.cartData()).toBeNull();
    });

    it('should add product to guest cart and update signals', async () => {
      const mockProduct = {
        _id: 'prod123',
        price: 150,
        title: 'Mock Product',
        imageCover: 'mock-cover.jpg',
        category: { name: 'Electronics' }
      };

      const response = await firstValueFrom(service.addToCart('prod123', mockProduct));
      expect(response.status).toBe('success');
      expect(response.numOfCartItems).toBe(1);
      expect(response.data.products.length).toBe(1);
      expect(response.data.products[0].product.title).toBe('Mock Product');
      expect(response.data.totalCartPrice).toBe(150);

      // Check persistent localStorage state
      const storedCart = localStorage.getItem('guest_cart');
      expect(storedCart).toBeTruthy();
      expect(JSON.parse(storedCart!)[0].count).toBe(1);
    });

    it('should increment count when adding same product multiple times', async () => {
      const mockProduct = {
        _id: 'prod123',
        price: 150,
        title: 'Mock Product'
      };

      await firstValueFrom(service.addToCart('prod123', mockProduct));
      const response = await firstValueFrom(service.addToCart('prod123', mockProduct));

      expect(response.numOfCartItems).toBe(2);
      expect(response.data.products[0].count).toBe(2);
      expect(response.data.totalCartPrice).toBe(300);
    });

    it('should update item count in guest cart', async () => {
      const mockProduct = {
        _id: 'prod123',
        price: 100,
        title: 'Mock Product'
      };

      await firstValueFrom(service.addToCart('prod123', mockProduct));
      const response = await firstValueFrom(service.updateCartItemCount('prod123', 5));

      expect(response.numOfCartItems).toBe(5);
      expect(response.data.products[0].count).toBe(5);
      expect(response.data.totalCartPrice).toBe(500);
    });

    it('should remove product from guest cart', async () => {
      const mockProduct = {
        _id: 'prod123',
        price: 100,
        title: 'Mock Product'
      };

      await firstValueFrom(service.addToCart('prod123', mockProduct));
      const response = await firstValueFrom(service.removeCartItem('prod123'));

      expect(response.numOfCartItems).toBe(0);
      expect(response.data.products.length).toBe(0);
      expect(response.data.totalCartPrice).toBe(0);
    });

    it('should clear guest cart', async () => {
      const mockProduct = {
        _id: 'prod123',
        price: 100,
        title: 'Mock Product'
      };

      await firstValueFrom(service.addToCart('prod123', mockProduct));
      const response = await firstValueFrom(service.clearCart());

      expect(response.message).toBe('success');
      expect(service.numOfCartItems()).toBe(0);
      expect(service.cartData()).toBeNull();
    });
  });
});
