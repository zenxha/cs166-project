import { http, HttpResponse } from 'msw'

interface LoginRequest {
  email: string
  password: string
}

export const handlers = [
  // Mock user login
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest

    if (email === 'user@example.com' && password === 'password') {
      return HttpResponse.json({
        id: 1,
        name: 'John Doe',
        role: 'customer',
      })
    }

    return new HttpResponse(null, { status: 401 })
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

  http.get('/favicon.ico', () => new HttpResponse(null, { status: 204 })),
]
