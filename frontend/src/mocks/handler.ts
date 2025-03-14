import { log } from 'console';
import { http, HttpResponse } from 'msw';
import jwt from 'jsonwebtoken';
import { rollupVersion } from 'vite';

interface LoginRequest {
  login: string;
  password: string;
}

interface OrderItem {
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
  password: string;
  phoneNum: string;
}

interface UserProfile {
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
  role: 'customer' | 'driver' | 'admin';
  favoriteItem: string;
  phoneNum: string;
  password: string;
}

interface OrderReceiptEntry {
  itemname: string;
  quantity: number;
}

type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered';

interface Order {
  orderid: number;
  login: string;
  storeid: number;
  totalprice: number;
  ordertimestamp: string;
  orderstatus: OrderStatus;
  items: OrderReceiptEntry[];
}

let mockUsers: User[] = [
  {
    login: 'user',
    role: 'customer',
    favoriteItem: 'Burger',
    phoneNum: '123-456-7890',
    password: 'user',
  },
  {
    login: 'driver',
    role: 'driver',
    favoriteItem: 'Burger',
    phoneNum: '987-654-3210',
    password: 'driver',
  },
  {
    login: 'admin',
    role: 'admin',
    favoriteItem: 'Burger',
    phoneNum: '555-555-5555',
    password: 'admin',
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

let mockOrders: Order[] = [
  {
    orderid: 1,
    login: 'John Doe',
    storeid: 101,
    totalprice: 27.74,
    ordertimestamp: '2024-03-11T12:30:00Z',
    orderstatus: 'Pending',
    items: [
      { itemname: 'Burger', quantity: 2 },
      { itemname: 'Fries', quantity: 1 },
    ],
  },
  {
    orderid: 2,
    login: 'Jane Smith',
    storeid: 102,
    totalprice: 20.5,
    ordertimestamp: '2024-03-10T15:45:00Z',
    orderstatus: 'Out for Delivery',
    items: [
      { itemname: 'Pizza', quantity: 1 },
      { itemname: 'Salad', quantity: 1 },
    ],
  },
  {
    orderid: 3,
    login: 'admin',
    storeid: 103,
    totalprice: 23.75,
    ordertimestamp: '2024-03-09T18:20:00Z',
    orderstatus: 'Delivered',
    items: [
      { itemname: 'Sushi', quantity: 1 },
      { itemname: 'Taco', quantity: 2 },
    ],
  },
  {
    orderid: 4,
    login: 'admin',
    storeid: 103,
    totalprice: 23.75,
    ordertimestamp: '2024-03-09T18:20:00Z',
    orderstatus: 'Delivered',
    items: [
      { itemname: 'Sushi', quantity: 1 },
      { itemname: 'Taco', quantity: 2 },
    ],
  },
  {
    orderid: 5,
    login: 'admin',
    storeid: 103,
    totalprice: 23.75,
    ordertimestamp: '2024-03-09T18:20:00Z',
    orderstatus: 'Delivered',
    items: [
      { itemname: 'Sushi', quantity: 1 },
      { itemname: 'Taco', quantity: 2 },
    ],
  },
  {
    orderid: 6,
    login: 'admin',
    storeid: 103,
    totalprice: 23.75,
    ordertimestamp: '2024-03-09T18:20:00Z',
    orderstatus: 'Delivered',
    items: [
      { itemname: 'Sushi', quantity: 1 },
      { itemname: 'Taco', quantity: 2 },
    ],
  },
  {
    orderid: 7,
    login: 'admin',
    storeid: 103,
    totalprice: 23.75,
    ordertimestamp: '2024-03-09T18:20:00Z',
    orderstatus: 'Delivered',
    items: [
      { itemname: 'Sushi', quantity: 1 },
      { itemname: 'Taco', quantity: 2 },
    ],
  },
  {
    orderid: 8,
    login: 'admin',
    storeid: 103,
    totalprice: 23.75,
    ordertimestamp: '2024-03-09T18:20:00Z',
    orderstatus: 'Delivered',
    items: [
      { itemname: 'Sushi', quantity: 1 },
      { itemname: 'Taco', quantity: 2 },
    ],
  },
];

const SECRET_KEY = 'mock_secret_key';
let activeSessions = new Map<string, string>();

const findUser = (login: string) => mockUsers.find((u) => u.login === login);

const authenticateToken = (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) return null;

  try {
    return jwt.verify(token, SECRET_KEY) as { login: string; role: string };
  } catch (error) {
    return null;
  }
};

const getUserRole = (login: string) => {
  const user = mockUsers.find((u) => u.login === login);
  return user ? user.role : 'customer';
};

export const handlers = [
  // Mock user register
  http.post('/api/auth/register', async ({ request }) => {
    const { login, password, phoneNum } = (await request.json()) as RegisterRequest;

    if (!login|| !password || !phoneNum) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json({
      message: 'Registration successful!',
      user: {
        id: Math.floor(Math.random() * 1000),
        phoneNum,
        role: 'customer',
        favoriteItem: null,
      },
    });
  }),

  // Mock user login
  http.post('/api/auth/login', async ({ request }) => {
    const { login, password } = (await request.json()) as LoginRequest;
    const user = mockUsers.find((u) => u.login === login && u.password === password);

    if (!user) {
      return new HttpResponse(null, { status: 401, statusText: 'Could not log in' });
    }

    const token = jwt.sign({ login: user.login, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    activeSessions.set(user.login, token);

    return HttpResponse.json({
      token,
      user: {
        login: user.login,
        role: user.role,
      },
    });
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new HttpResponse(null, { status: 400, statusText: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { login: string };
      activeSessions.delete(decoded.login);
      return new HttpResponse(null, { status: 200 });
    } catch (error) {
      return new HttpResponse(null, { status: 401, statusText: 'Invalid token' });
    }
  }),

  http.get('/api/user/profile', async ({ request }) => {
    const decoded = authenticateToken(request);
    if (!decoded) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    const user = findUser(decoded.login);
    if (!user) {
      return new HttpResponse(null, { status: 404, statusText: 'User Not Found' });
    }

    return HttpResponse.json({
      role: user.role,
      favoriteItem: user.favoriteItem,
      phoneNum: user.phoneNum,
    });
  }),

  http.put('/api/user/profile', async ({ request }) => {
    const decoded = authenticateToken(request);
    if (!decoded) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    let user = findUser(decoded.login);
    if (!user) {
      return new HttpResponse(null, { status: 404, statusText: 'User Not Found' });
    }

    // Parse update request
    const updatedFields = (await request.json()) as Partial<UserProfile>;
    user = { ...user, ...updatedFields };

    // Update in mock database
    mockUsers = mockUsers.map((u) => (u.login === decoded.login ? user : u));

    return HttpResponse.json({ message: 'Profile updated successfully!', updatedProfile: user });
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
    const { storeId, items, login } = (await request.json()) as {
      storeId: number;
      items: { itemname: string; quantity: number; price: number }[];
      login: string;
    };

    if (!storeId || !login || items.length === 0) {
      return new HttpResponse(null, { status: 400 });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('Received post to order, computed totalPrice to be', totalPrice);

    const newOrder: Order = {
      orderid: mockOrders.length + 1, // Generate a new order ID
      login,
      storeid: storeId,
      totalprice: totalPrice,
      ordertimestamp: new Date().toISOString(),
      orderstatus: 'Pending', // Default status for a new order
      items: items.map(({ itemname, quantity }) => ({ itemname, quantity })),
    };

    mockOrders.push(newOrder); // Insert into mockOrders array

    return HttpResponse.json({
      orderId: newOrder.orderid,
      totalprice: newOrder.totalprice,
      message: 'Order placed successfully!',
    });
  }),

  http.get('/api/orders', async ({ request }) => {
    const url = new URL(request.url);
    const loginFilter = url.searchParams.get('login');
    const limit = Number(url.searchParams.get('limit')) || 5;
    const page = Number(url.searchParams.get('page')) || 1;

    let filteredOrders = mockOrders;
    if (loginFilter) {
      filteredOrders = filteredOrders.filter((order) => order.login === loginFilter);
    }

    // return HttpResponse.json(filteredOrders.slice(0, limit));
    const start = (page - 1) * limit;
    const end = start + limit;
    return HttpResponse.json({
      orders: filteredOrders.slice(start, end),
      totalOrders: filteredOrders.length,
    });
  }),

  http.get('/api/orders/:id', async ({ params }) => {
    const { id } = params;
    console.log('Looking up order with ID:', id);

    const order = mockOrders.find((o) => o.orderid === Number(id));
    if (order) {
      console.log('Found order:', order);
      return HttpResponse.json(order);
    }

    console.log('Order not found');
    return new HttpResponse(null, { status: 404 });
  }),

  http.put('/api/orders/:id', async ({ params, request }) => {
    const { id } = params;
    console.log('Looking up order', id);
    const { orderstatus } = (await request.json()) as { orderstatus: OrderStatus };
    console.log('Backend handler heard request for orders/id with id as', id);

    const orderIndex = mockOrders.findIndex((o) => o.orderid === Number(id));
    if (orderIndex !== -1) {
      mockOrders[orderIndex].orderstatus = orderstatus;
      return HttpResponse.json(mockOrders[orderIndex]);
    }
    return new HttpResponse(null, { status: 404 });
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
