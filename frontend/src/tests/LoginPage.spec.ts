import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import axios from 'axios';
import { setActivePinia, createPinia } from 'pinia';

import LoginPage from '@/pages/LoginPage.vue';
import { useAuthStore } from '@/stores/auth';

vi.mock('axios');

describe('LoginPage.vue', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
  });

  it('logs in successfully with correct credentials', async () => {
    // Mock API response
    (axios.post as vi.Mock).mockResolvedValue({
      data: { id: 1, role: 'customer' },
    });

    const wrapper = mount(LoginPage);
    await wrapper.find('input[type="email"]').setValue('user@example.com');
    await wrapper.find('input[type="password"]').setValue('password');
    await wrapper.find('button').trigger('click');

    // Ensure API was called
    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'user@example.com',
      password: 'password',
    });

    // Ensure user was logged in
    expect(authStore.user).toEqual({ id: 1, role: 'customer' });
  });

  it('shows error message for incorrect credentials', async () => {
    (axios.post as vi.Mock).mockRejectedValue(new Error('Invalid credentials'));

    const wrapper = mount(LoginPage);
    await wrapper.find('input[type="email"]').setValue('wrong@example.com');
    await wrapper.find('input[type="password"]').setValue('wrongpassword');
    await wrapper.find('button').trigger('click');

    expect(wrapper.text()).toContain('Invalid login credentials');
  });
});
