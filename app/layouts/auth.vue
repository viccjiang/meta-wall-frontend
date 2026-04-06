<template>
  <div class="flex min-h-screen items-center justify-center bg-warning">
    <div class="w-full max-w-md px-4">
      <h1 class="mb-8 text-center font-logo text-4xl text-dark">
        MetaWall
      </h1>
      <div class="rounded-lg border-2 border-dark bg-white p-8 shadow-[4px_4px_0_#1B3E4F]">
        <slot />
      </div>
    </div>
  </div>
</template>
