import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/RegisterPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/pages/MenuPage.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('@/pages/PlaceOrderPage.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/manage',
      redirect: '/manage/orders',
      meta: {
        requiresAuth: true,
        requiresDriver: true,
      },
    },
    {
      path: '/manage/users',
      name: 'manage users',
      component: () => import('@/pages/ManageUsersPage.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/manage/menu',
      name: 'manage menu',
      component: () => import('@/pages/ManageMenuPage.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/manage/orders',
      name: 'manage orders',
      component: () => import('@/pages/ManageOrdersPage.vue'),
      meta: {
        requiresAuth: true,
        requiresDriver: true,
      },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login'); // Redirect to login if not authenticated
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/menu');
  } else if (to.meta.requiresDriver && !(authStore.isAdmin || authStore.isDriver)) {
    next('/menu');
  } else {
    next(); // Proceed as normal
  }
});

export default router;
