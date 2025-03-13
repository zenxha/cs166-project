import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export type MenuItem = {
  id: number
  name: string
  type: string
  price: number
}

export const useMenuStore = defineStore('menu', () => {
  const items = ref<MenuItem[]>([])
  const filterType = ref<string | null>(null)
  const sortOrder = ref<'asc' | 'desc' | null>(null)

  async function fetchMenu() {
    try {
      const response = await axios.get<MenuItem[]>('/api/menu')
      items.value = response.data
    } catch (error) {
      console.error('Failed to fetch menu:', error)
    }
  }

  const filteredItems = computed(() => {
    let result = [...items.value]

    if (filterType.value) {
      result = result.filter((item) => item.type === filterType.value)
    }

    if (sortOrder.value) {
      result.sort((a, b) => (sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price))
    }

    return result
  })

  return { items, filteredItems, fetchMenu, filterType, sortOrder }
})
