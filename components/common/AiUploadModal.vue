<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="close">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-medium text-gray-900">Attach File for Akeel</h3>
          <button @click="close" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <CommonAiStatusBox :message="error" :variant="errorVariant" />

        <div class="border-2 border-dashed border-primary-100/40 bg-primary-100/5 rounded-xl p-8 text-center cursor-pointer"
          @click="fileInput?.click()" @dragover.prevent @drop.prevent="onDrop">
          <input ref="fileInput" type="file" class="hidden" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls" @change="onFileChange" />
          <p class="text-sm text-gray-700 mb-1">Click to upload or drag and drop</p>
          <p class="text-xs text-gray-400">PDF up to 4MB, image up to 2MB, Excel up to 15MB</p>
        </div>

        <div v-if="uploading" class="text-xs text-gray-500 mt-3">Uploading and processing…</div>

        <div v-if="pendingUploads.length" class="mt-4 space-y-1.5">
          <div v-for="u in pendingUploads" :key="u.id" class="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
            <span class="text-black">{{ u.file_type?.toUpperCase() }} — {{ u.has_extracted_content ? 'ready' : 'no text extracted' }}</span>
            <button @click="removeUpload(u.id)" class="text-gray-500 hover:text-red-500">✕</button>
          </div>
        </div>

        <div class="flex justify-end mt-5">
          <button @click="close" class="bg-[#00B69B] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#008472] transition-colors">Done</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['update:open'])

const { pendingUploads, uploading, error, errorVariant, uploadFile, removeUpload } = useAkeel()
const fileInput = ref(null)

// Mirrors config('ai.upload_max_kb') server-side — fast-fail UX only, backend re-validates.
const MAX_MB = { pdf: 4, png: 2, jpg: 2, jpeg: 2, xlsx: 15, xls: 15 }

function close() {
  emit('update:open', false)
}

async function handleFile(file) {
  if (!file) return

  const ext = file.name.split('.').pop()?.toLowerCase()
  const maxMb = MAX_MB[ext]
  if (maxMb && file.size > maxMb * 1024 * 1024) {
    error.value = `File too large — max ${maxMb}MB for .${ext} files.`
    errorVariant.value = 'error'
    return
  }

  await uploadFile(file)
  if (fileInput.value) fileInput.value.value = ''
}

function onFileChange(e) {
  handleFile(e.target.files?.[0])
}

function onDrop(e) {
  handleFile(e.dataTransfer?.files?.[0])
}
</script>
