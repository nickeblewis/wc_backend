<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Cake {
  id: number;
  name: string;
  comment?: string;
  imageUrl?: string;
  yumFactor?: number;
}

const cakes = ref<Cake[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await fetch('/cakes');
    if (!res.ok) throw new Error(`Failed to load cakes (${res.status})`);
    cakes.value = await res.json();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-orange-50">
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h1 class="text-4xl font-bold text-orange-800 mb-2">Wara Cakes</h1>
      <p class="text-orange-600 mb-8">Welcome! Here are our delicious cakes.</p>

      <div v-if="loading" class="text-orange-400 text-lg">Loading cakes…</div>

      <div v-else-if="error" class="text-red-500">{{ error }}</div>

      <div v-else-if="cakes.length === 0" class="text-gray-400">
        No cakes yet. Add some via the API!
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="cake in cakes"
          :key="cake.id"
          class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
        >
          <img
            v-if="cake.imageUrl"
            :src="cake.imageUrl"
            :alt="cake.name"
            class="w-full h-44 object-cover"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          />
          <div class="p-5 flex flex-col gap-2 flex-1">
            <h2 class="text-lg font-semibold text-gray-800">{{ cake.name }}</h2>
            <p v-if="cake.comment" class="text-gray-500 text-sm flex-1">{{ cake.comment }}</p>
            <p v-if="cake.yumFactor" class="text-base">
              {{ '⭐'.repeat(cake.yumFactor) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
