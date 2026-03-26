<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useForm } from '@tanstack/vue-form';
import StarRating from 'vue-star-rating';
import vueFilePond from 'vue-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType);

interface Cake {
  id: number;
  name: string;
  comment: string;
  imageUrl: string;
  yumFactor: number;
}

const cakes = ref<Cake[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedCake = ref<Cake | null>(null);
const cakeToDelete = ref<Cake | null>(null);
const showAddModal = ref(false);

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

async function confirmDelete() {
  if (!cakeToDelete.value) return;
  await fetch(`/cakes/${cakeToDelete.value.id}`, { method: 'DELETE' });
  cakes.value = cakes.value.filter(c => c.id !== cakeToDelete.value!.id);
  cakeToDelete.value = null;
}

const form = useForm({
  defaultValues: {
    name: '',
    comment: '',
    yumFactor: 1,
    imageUrl: '',
  },
  onSubmit: async ({ value }) => {
    const res = await fetch('/cakes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
    if (res.ok) {
      const newCake = await res.json();
      cakes.value.push(newCake);
      showAddModal.value = false;
      form.reset();
    }
  },
});
</script>

<template>
  <div class="min-h-screen bg-orange-50">
    <nav class="bg-white border-b border-orange-100 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" class="text-xl font-bold text-orange-800 hover:text-orange-600 transition-colors">Wara Cakes</a>
        <button
          class="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          @click="showAddModal = true"
        >+ Add Cake</button>
      </div>
    </nav>

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
            class="w-full h-44 object-cover cursor-pointer"
            @click="selectedCake = cake"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          />
          <div class="p-5 flex flex-col gap-2 flex-1">
            <h2 class="text-lg font-semibold text-gray-800">{{ cake.name }}</h2>
            <div class="flex gap-3 pt-1">
              <button class="text-gray-400 hover:text-blue-500 transition-colors" title="View" @click="selectedCake = cake">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <button class="text-gray-400 hover:text-red-500 transition-colors" title="Delete" @click="cakeToDelete = cake">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          class="border-2 border-dashed border-red-400 rounded-2xl flex items-center justify-center min-h-44 cursor-pointer hover:bg-red-50 transition-colors"
          @click="showAddModal = true"
        >
          <span class="text-red-400 text-lg font-medium">+ Add a new cake</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Detail dialog -->
  <Teleport to="body">
    <div
      v-if="selectedCake"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="selectedCake = null"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <img
          v-if="selectedCake.imageUrl"
          :src="selectedCake.imageUrl"
          :alt="selectedCake.name"
          class="w-full h-56 object-cover"
        />
        <div class="p-6 flex flex-col gap-3">
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-2xl font-bold text-gray-800">{{ selectedCake.name }}</h2>
            <button class="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none" @click="selectedCake = null">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <p v-if="selectedCake.comment" class="text-gray-500">{{ selectedCake.comment }}</p>
          <p v-if="selectedCake.yumFactor" class="text-xl">
            {{ '⭐'.repeat(selectedCake.yumFactor) }}
          </p>
          <p class="text-xs text-gray-300">ID: {{ selectedCake.id }}</p>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Delete confirmation dialog -->
  <Teleport to="body">
    <div
      v-if="cakeToDelete"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-5">
        <h2 class="text-lg font-semibold text-gray-800">Are you sure?</h2>
        <p class="text-gray-500 text-sm">This will permanently delete <span class="font-medium text-gray-700">{{ cakeToDelete.name }}</span>.</p>
        <div class="flex gap-3 justify-end">
          <button
            class="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            @click="cakeToDelete = null"
          >No</button>
          <button
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            @click="confirmDelete"
          >Yes</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Add cake dialog -->
  <Teleport to="body">
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showAddModal = false; form.reset()"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">Add a new cake</h2>
          <button class="text-gray-400 hover:text-gray-600 transition-colors text-xl" @click="showAddModal = false; form.reset()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="form.handleSubmit" class="flex flex-col gap-4">

          <!-- Name -->
          <form.Field name="name" :validators="{ onChange: ({ value }) => !value.trim() ? 'Name is required' : undefined }">
            <template #default="{ field }">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Name <span class="text-red-400">*</span></label>
                <input
                  :value="field.state.value"
                  @input="field.handleChange(($event.target as HTMLInputElement).value)"
                  @blur="field.handleBlur"
                  placeholder="e.g. Victoria Sponge"
                  class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  :class="{ 'border-red-400': field.state.meta.isTouched && field.state.meta.errors.length }"
                />
                <span v-if="field.state.meta.isTouched && field.state.meta.errors.length" class="text-xs text-red-500">
                  {{ field.state.meta.errors[0] }}
                </span>
              </div>
            </template>
          </form.Field>

          <!-- Comment -->
          <form.Field name="comment" :validators="{ onChange: ({ value }) => !value.trim() ? 'Comment is required' : undefined }">
            <template #default="{ field }">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Comment <span class="text-red-400">*</span></label>
                <textarea
                  :value="field.state.value"
                  @input="field.handleChange(($event.target as HTMLTextAreaElement).value)"
                  @blur="field.handleBlur"
                  placeholder="Describe the cake…"
                  rows="3"
                  class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  :class="{ 'border-red-400': field.state.meta.isTouched && field.state.meta.errors.length }"
                />
                <span v-if="field.state.meta.isTouched && field.state.meta.errors.length" class="text-xs text-red-500">
                  {{ field.state.meta.errors[0] }}
                </span>
              </div>
            </template>
          </form.Field>

          <!-- Yum Factor -->
          <form.Field
            name="yumFactor"
            :validators="{ onChange: ({ value }) => (value < 1 || value > 5) ? 'Pick a yum factor between 1 and 5' : undefined }"
          >
            <template #default="{ field }">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Yum Factor</label>
                <StarRating
                  :rating="field.state.value"
                  :max-rating="5"
                  :increment="1"
                  :star-size="32"
                  active-color="#f97316"
                  inactive-color="#d1d5db"
                  :show-rating="false"
                  @update:rating="field.handleChange($event); field.handleBlur()"
                />
                <span v-if="field.state.meta.isTouched && field.state.meta.errors.length" class="text-xs text-red-500">
                  {{ field.state.meta.errors[0] }}
                </span>
              </div>
            </template>
          </form.Field>

          <!-- Image upload -->
          <form.Field name="imageUrl" :validators="{ onChange: ({ value }) => !value ? 'Image is required' : undefined }">
            <template #default="{ field }">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Image <span class="text-red-400">*</span></label>
                <FilePond
                  accepted-file-types="image/*"
                  label-idle="Drag & drop an image or <span class='filepond--label-action'>browse</span>"
                  :server="{
                    url: '/upload',
                    process: {
                      method: 'POST',
                      onload: (res: string) => { field.handleChange(JSON.parse(res).url); return JSON.parse(res).url; }
                    },
                    revert: null,
                    load: null,
                    restore: null,
                    fetch: null,
                  }"
                  :allow-multiple="false"
                />
                <span v-if="field.state.meta.isTouched && field.state.meta.errors.length" class="text-xs text-red-500">
                  {{ field.state.meta.errors[0] }}
                </span>
              </div>
            </template>
          </form.Field>

          <div class="flex gap-3 justify-end pt-1">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              @click="showAddModal = false; form.reset()"
            >Cancel</button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >Add Cake</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
