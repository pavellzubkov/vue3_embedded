<template>
  <div>
    <UploadFileC
      file-name="Decoder J1939"
      key-name="j1939decoder"
      :json-shemas="decoderShemas"
      :default-data="decoderDefault"
      @loaded="updated = true"
    ></UploadFileC>
    <UploadFileC
      file-name="Aliaces J1939"
      key-name="j1939aliaces"
      :json-shemas="aliacesShemas"
      :default-data="aliasesDefault"
      @loaded="updated = true"
    ></UploadFileC>
    <UploadFileC
      file-name="Errors J1939"
      key-name="j1939errors"
      :json-shemas="errorsFileShemas"
      :default-data="j1939errorsDefault"
      @loaded="updated = true"
    ></UploadFileC>
  </div>
</template>

<script lang="ts" setup>
import { aliasesDefault } from '@/components/j1939/components/Files/Shemas/aliacesDefault'
import { decoderDefault } from '@/components/j1939/components/Files/Shemas/decoderDefault'
import { j1939errorsDefault } from '@/components/j1939/components/Files/Shemas/j1939errorsDefault'
import { errorsFileShemas } from '@/components/j1939/components/Files/Shemas/j1939errorsShema'
import { aliacesShemas } from '@/components/j1939/components/Files/Shemas/j1939SourcesAliasesShema'
import { decoderShemas } from '@/components/j1939/components/Files/Shemas/j1939TemplateShema'
import { J1939decoder } from '@/components/j1939/DecodeJ1939MessClass'

const updated = ref(false)

onUnmounted(async () => {
  if (updated.value) {
    J1939decoder.resetAll()
    await J1939decoder.updateAllFiles()
  }
})
</script>

<style scoped></style>
