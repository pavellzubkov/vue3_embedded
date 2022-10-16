<template>
  <div class="w3-card-2 w3-hover-shadow w3-border-theme w3-border w3-round-medium w3-padding-small card-thin" v-if="visible">
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 1.2em">{{ fileName }}</label>
      <span class="w3-bar-item"> v:{{ version }}</span>
      <DescriptionButC :description-text="description" class="w3-bar-item"></DescriptionButC>
      <div class="w3-right" style="display: inline-flex">
        <input type="file" id="input" ref="input" :value="filePathValue" accept="application/json" style="display: none" @change="handleFiles" />
        <MyIconC icon="Upload" tooltip="Загрузить" class="icon-button w3-padding" @click="selectFile"></MyIconC>
        <MyIconC icon="Download" tooltip="Скачать" class="icon-button w3-padding" @click="downloadFile"></MyIconC>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IFileIdbKey } from '@/AAConnections/IDBStore/StoreFilesClass'
import { LoadFileClass } from '@/components/j1939/components/Files/LoadFileClass'
import type { IFileData } from '@/components/j1939/components/Files/Shemas/decoderData'
import type { AnySchema } from 'ajv/dist/types'
import type { PropType } from 'vue'

const props = defineProps({
  fileName: {
    type: String
  },
  keyName: {
    type: String as PropType<IFileIdbKey>,
    required: true
  },
  remoteName: {
    type: String
  },
  jsonShemas: {
    type: Array as PropType<AnySchema[]>,
    required: true
  },
  isLocal: {
    type: Boolean,
    default: false,
    required: false
  },
  defaultData: {
    type: Object as PropType<IFileData>
  }
})
const visible = ref(true)
const input = ref()
const filePathValue = ref(null)
const emit = defineEmits(['loaded'])
const StoreInst: LoadFileClass = new LoadFileClass(props.keyName, props.jsonShemas)
const description = StoreInst.description
const version = StoreInst.version

const selectFile = () => {
  input.value.click()
  filePathValue.value = null
}

const downloadFile = async () => {
  await StoreInst?.downloadFile(props.fileName)
}

const handleFiles = async (event: Event) => {
  const file = input.value.files[0]
  const ftext = await file.text()
  const res = await StoreInst?.storeFile(ftext)
  if (res) emit('loaded')
}

onMounted(async () => {
  await StoreInst?.init(props.defaultData)
  // StoreInst?.destroy()
})

onUnmounted(() => {
  StoreInst?.destroy()
  visible.value = false
})
</script>
