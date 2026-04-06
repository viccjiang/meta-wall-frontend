<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { apiFetch } = useApi()

const handleCreate = async (data: { content: string; photo: string }) => {
  try {
    await apiFetch('/posts/', {
      method: 'POST',
      body: data,
    })
    navigateTo('/')
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    alert(e?.data?.message || '發文失敗')
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h2 class="mb-4 text-lg font-bold text-dark">
      張貼動態
    </h2>
    <PostForm @submitted="handleCreate" />
  </div>
</template>
