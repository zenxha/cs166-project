import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MenuPage from '@/pages/MenuPage.vue';
import { useMenuStore } from '@/stores/menu';
import axios from 'axios';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('axios');

describe('MenuPage.vue', () => {
  let menuStore: ReturnType<typeof useMenuStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    menuStore = useMenuStore();
  });

  it('fetches and displays menu items', async () => {
    // Mock API response
    (axios.get as vi.Mock).mockResolvedValue({
      data: [
        { id: 1, name: 'Pepperoni Pizza', type: 'main', price: 12.99 },
        { id: 2, name: 'Cheeseburger', type: 'main', price: 10.99 },
        { id: 3, name: 'Coke', type: 'drink', price: 1.99 },
      ],
    });

    const wrapper = mount(MenuPage);

    // Wait for the fetchMenu function to execute
    await menuStore.fetchMenu();

    // Ensure API was called
    expect(axios.get).toHaveBeenCalledWith('/api/menu');

    // Ensure menu items are displayed
    expect(wrapper.text()).toContain('Pepperoni Pizza');
    expect(wrapper.text()).toContain('Cheeseburger');
    expect(wrapper.text()).toContain('Coke');
  });

  it('filters menu items by type', async () => {
    menuStore.items = [
      { id: 1, name: 'Pepperoni Pizza', type: 'main', price: 12.99 },
      { id: 2, name: 'Coke', type: 'drink', price: 1.99 },
    ];

    const wrapper = mount(MenuPage);

    // Set filter to "Drinks"
    menuStore.filterType = 'drink';
    await wrapper.vm.$nextTick();

    // Ensure only drinks are displayed
    expect(wrapper.text()).not.toContain('Pepperoni Pizza');
    expect(wrapper.text()).toContain('Coke');
  });

  it('sorts menu items by price (ascending)', async () => {
    menuStore.items = [
      { id: 1, name: 'Pepperoni Pizza', type: 'main', price: 12.99 },
      { id: 2, name: 'Coke', type: 'drink', price: 1.99 },
      { id: 3, name: 'Fries', type: 'side', price: 3.49 },
    ];

    const wrapper = mount(MenuPage);

    // Set sorting to ascending order
    menuStore.sortOrder = 'asc';
    await wrapper.vm.$nextTick();

    const prices = wrapper
      .findAll('p.font-bold')
      .map((node) => parseFloat(node.text().replace('$', '')));

    // Ensure prices are in ascending order
    expect(prices).toEqual([1.99, 3.49, 12.99]);
  });

  it('sorts menu items by price (descending)', async () => {
    menuStore.items = [
      { id: 1, name: 'Pepperoni Pizza', type: 'main', price: 12.99 },
      { id: 2, name: 'Coke', type: 'drink', price: 1.99 },
      { id: 3, name: 'Fries', type: 'side', price: 3.49 },
    ];

    const wrapper = mount(MenuPage);

    // Set sorting to descending order
    menuStore.sortOrder = 'desc';
    await wrapper.vm.$nextTick();

    const prices = wrapper
      .findAll('p.font-bold')
      .map((node) => parseFloat(node.text().replace('$', '')));

    // Ensure prices are in descending order
    expect(prices).toEqual([12.99, 3.49, 1.99]);
  });
});
