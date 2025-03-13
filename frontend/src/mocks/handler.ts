import { http, HttpResponse } from 'msw'

interface LoginRequest {
  email: string
  password: string
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderRequest {
  storeId: number;
  items: OrderItem[];
}

interface RegisterRequest {
  fname: string;
  lname: string;
  email: string;
  password: string;
  phoneNum: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNum: string;
  favoriteItem: string;
}

let mockUserProfile : UserProfile = {
  id: 1,
  name: 'John Doe',
  email: 'user@example.com',
  phoneNum: '123-456-7890',
  favoriteItem: 'Pepperoni Pizza',
};

export const handlers = [
  // Mock user register
  http.post('/api/auth/register', async ({ request }) => {
    const { fname, lname, email, password, phoneNum } = (await request.json()) as RegisterRequest;

    if (!fname || !lname || !email || !password || !phoneNum) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json({
      message: 'Registration successful!',
      user: {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
        phoneNum,
        role: 'customer',
        favoriteItem: null,
      },
    });
  }),

  // Mock user login
  http.post('/api/auth/login', async ({ request }) => {
    console.log("Got auth login request!")
    const { email, password } = (await request.json()) as LoginRequest

    if (email === 'user@example.com' && password === 'password') {
      return HttpResponse.json({
        id: 1,
        fname: 'John',
        lname: 'Doe',
        role: 'customer',
      })
    }

    return new HttpResponse(null, { status: 401 })
  }),

  http.get('/api/user/profile', () => {
    return HttpResponse.json(mockUserProfile);
  }),

  http.put('/api/user/profile', async ({ request }) => {
    const updatedFields = await request.json() as Partial<UserProfile>;

    // Create a new object instead of mutating the original one
    const updatedProfile: UserProfile = {
        ...mockUserProfile,
        ...Object.fromEntries(
            Object.entries(updatedFields).filter(([key]) => key in mockUserProfile)
        )
    };

    // Optionally, update mockUserProfile if mutability is required
    Object.assign(mockUserProfile, updatedProfile);

    return HttpResponse.json({ message: 'Profile updated successfully!', updatedProfile });
  }),


  // Mock menu items
  http.get('/api/menu', () => {
    return HttpResponse.json([
      { id: 1, name: 'Pepperoni Pizza', type: 'main', price: 12.99 },
      { id: 2, name: 'Cheeseburger', type: 'main', price: 10.99 },
      { id: 3, name: 'Coke', type: 'drink', price: 1.99 },
      { id: 4, name: 'Fries', type: 'side', price: 3.49 },
      { id: 5, name: 'Margherita Pizza', type: 'main', price: 11.99 },
    ])
  }),

  http.get('/api/stores', () => {
    return HttpResponse.json([
      { id: 1, name: 'Downtown Store', location: '123 Main St', reviewScore: 4.5, isOpen: true },
      { id: 2, name: 'Uptown Store', location: '456 High St', reviewScore: 4.2, isOpen: true },
      { id: 3, name: 'Suburban Store', location: '789 Elm St', reviewScore: 3.9, isOpen: false },
    ]);
  }),

  http.post('/api/order', async ({ request }) => {
    const { storeId, items } = await request.json() as OrderRequest;

    if (!storeId || items.length === 0) {
      return new HttpResponse(null, { status: 400 });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return HttpResponse.json({
      orderId: Math.floor(Math.random() * 10000),
      totalPrice,
      message: 'Order placed successfully!',
    });
  }),

  // http.get('/favicon.ico', () => new HttpResponse(null, { status: 204 })),
]
