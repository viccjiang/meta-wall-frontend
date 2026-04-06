<script setup lang="ts">
const emit = defineEmits<{
  submitted: [data: { content: string; photo: string }]
}>()

const content = ref('')
const photo = ref('')
const loading = ref(false)

const handleSubmit = () => {
  if (!content.value.trim()) return
  loading.value = true
  emit('submitted', {
    content: content.value,
    photo: photo.value,
  })
}

const reset = () => {
  content.value = ''
  photo.value = ''
  loading.value = false
}

defineExpose({ reset })
</script>

<template>
  <div class="rounded-lg border-2 border-dark bg-white p-4 shadow-[3px_3px_0_#1B3E4F]">
    <h3 class="mb-3 text-sm font-bold text-dark">
      張貼動態
    </h3>
    <form @submit.prevent="handleSubmit">
      <textarea
        v-model="content"
        rows="4"
        placeholder="說點什麼吧..."
        class="w-full resize-none rounded-lg border-2 border-dark p-3 text-sm focus:border-primary focus:outline-none"
      />
      <div class="mt-2">
        <input
          v-model="photo"
          type="url"
          placeholder="圖片網址（選填）"
          class="w-full rounded-lg border border-gray-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div class="mt-3 flex justify-end">
        <button
          type="submit"
          :disabled="!content.trim() || loading"
          class="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {{ loading ? '發送中...' : '送出' }}
        </button>
      </div>
    </form>
  </div>
</template>
