import { http, HttpResponse } from 'msw';

interface LoginRequest {
  email: string;
  password: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderRequest {
  login: string;
  storeId: number;
  items: OrderItem[];
}

interface RegisterRequest {
  login: string;
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

interface MenuItem {
  itemname: string;
  ingredients: string;
  price: number;
  typeofitem: string;
  description: string;
}

interface User {
  login: string;
  email: string;
  role: 'customer' | 'driver' | 'admin';
  favoriteItem: string;
  phoneNum: string;
}

let mockUsers: User[] = [
  {
    login: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    favoriteItem: 'Burger',
    phoneNum: '123-456-7890',
  },
  {
    login: 'Jane Smith',
    email: 'jane@example.com',
    role: 'driver',
    favoriteItem: 'Burger',
    phoneNum: '987-654-3210',
  },
  {
    login: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    favoriteItem: 'Burger',
    phoneNum: '555-555-5555',
  },
];

let mockMenu: MenuItem[] = [
  {
    itemname: 'Burger',
    ingredients: 'Beef patty, lettuce, tomato, cheese',
    price: 9.99,
    typeofitem: 'Main',
    description: 'Classic beef burger',
  },
  {
    itemname: 'Pizza',
    ingredients: 'Tomato sauce, mozzarella, pepperoni',
    price: 12.5,
    typeofitem: 'Main',
    description: 'Pepperoni pizza',
  },
  {
    itemname: 'Pasta',
    ingredients: 'Penne, tomato sauce, basil',
    price: 8.75,
    typeofitem: 'Main',
    description: 'Italian-style pasta',
  },
  {
    itemname: 'Sushi',
    ingredients: 'Rice, fish, seaweed',
    price: 15.0,
    typeofitem: 'Main',
    description: 'Assorted sushi rolls',
  },
  {
    itemname: 'Salad',
    ingredients: 'Lettuce, tomato, cucumber, dressing',
    price: 5.5,
    typeofitem: 'Side',
    description: 'Fresh garden salad',
  },
  {
    itemname: 'Taco',
    ingredients: 'Beef, lettuce, cheese, tortilla',
    price: 7.25,
    typeofitem: 'Main',
    description: 'Crunchy beef taco',
  },
  {
    itemname: 'Fries',
    ingredients: 'Potatoes, salt',
    price: 2.99,
    typeofitem: 'Sides',
    description: 'any potatoers in chat',
  },
];

let mockUserProfile: UserProfile = {
  id: 1,
  name: 'John Doe',
  email: 'user@example.com',
  phoneNum: '123-456-7890',
  favoriteItem: 'Pepperoni Pizza',
};

export const handlers = [
  // Mock user register
  http.post('/api/auth/register', async ({ request }) => {
    const { login, email, password, phoneNum } = (await request.json()) as RegisterRequest;

    if (!login || !email || !password || !phoneNum) {
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
    const { email, password } = (await request.json()) as LoginRequest;

    if (email === 'user@example.com' && password === 'password') {
      return HttpResponse.json({
        login: 'john_doe',
        role: 'customer',
      });
    } else if (email === 'admin@example.com' && password === 'admin') {
      return HttpResponse.json({
        login: 'admin',
        role: 'admin',
      });
    }

    return new HttpResponse(null, { status: 401 });
  }),

  http.get('/api/user/profile', () => {
    return HttpResponse.json(mockUserProfile);
  }),

  http.put('/api/user/profile', async ({ request }) => {
    const updatedFields = (await request.json()) as Partial<UserProfile>;

    // Create a new object instead of mutating the original one
    const updatedProfile: UserProfile = {
      ...mockUserProfile,
      ...Object.fromEntries(
        Object.entries(updatedFields).filter(([key]) => key in mockUserProfile),
      ),
    };

    // Optionally, update mockUserProfile if mutability is required
    Object.assign(mockUserProfile, updatedProfile);

    return HttpResponse.json({ message: 'Profile updated successfully!', updatedProfile });
  }),

  // Mock menu items
  // http.get('/api/menu', () => {
  //   return HttpResponse.json(mockMenu);
  // }),
  http.get('/api/menu', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // Get filter by type
    const maxprice = url.searchParams.get('maxprice'); // Get max price
    const sort = url.searchParams.get('sort'); // Get sorting order

    let filteredMenu = [...mockMenu];

    // Apply Type Filter
    if (type) {
      if (!['Main', 'Side'].includes(type)) {
        return HttpResponse.json({ error: 'Invalid menu item type specified' }, { status: 400 });
      }
      filteredMenu = filteredMenu.filter((item) => item.typeofitem === type);
    }

    // Apply Max Price Filter
    if (maxprice !== null) {
      const maxPriceNum = parseFloat(maxprice);
      if (!isNaN(maxPriceNum)) {
        filteredMenu = filteredMenu.filter((item) => item.price <= maxPriceNum);
      }
    }

    // Apply Sorting
    if (sort === 'asc') {
      filteredMenu.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      filteredMenu.sort((a, b) => b.price - a.price);
    }

    return HttpResponse.json(filteredMenu);
  }),

  // Add new menu items
  http.post('/api/menu', async ({ request }) => {
    const newItem = (await request.json()) as MenuItem;
    console.log('api server Received menuItem', newItem);
    mockMenu.push(newItem);
    return HttpResponse.json(newItem);
  }),

  http.put('/api/menu/:itemname', async ({ params, request }) => {
    const { itemname } = params;
    const updates = (await request.json()) as Partial<MenuItem>;

    const index = mockMenu.findIndex((item) => item.itemname === itemname);
    if (index !== -1) {
      mockMenu[index] = { ...mockMenu[index], ...updates };
      return HttpResponse.json(mockMenu[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get('/api/stores', () => {
    return HttpResponse.json([
      { id: 1, name: 'Downtown Store', location: '123 Main St', reviewScore: 4.5, isOpen: true },
      { id: 2, name: 'Uptown Store', location: '456 High St', reviewScore: 4.2, isOpen: true },
      { id: 3, name: 'Suburban Store', location: '789 Elm St', reviewScore: 3.9, isOpen: false },
    ]);
  }),

  http.post('/api/order', async ({ request }) => {
    const { storeId, items } = (await request.json()) as OrderRequest;

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

  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers);
  }),

  http.put('/api/users/:login', async ({ params, request }) => {
    const { login } = params;
    const updates = (await request.json()) as Partial<Omit<User, 'password'>>;

    // Find user & update fields (except password)
    const userIndex = mockUsers.findIndex((u) => u.login === login);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      return HttpResponse.json(mockUsers[userIndex]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // http.get('/favicon.ico', () => new HttpResponse(null, { status: 204 })),
];
