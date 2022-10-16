<template>
  <div class="app-container">
    <div class="w3-bar">
      <label class="w3-bar-item" style="font-size: 16px; font-weight: bold">Параметров на графике: </label>
      <span class="w3-bar-item description-value"> {{ graphDataLength }}</span>
      <div class="w3-bar-item padding-2">
        <ZoomTransC>
          <MyIconC v-if="graphDataLength > 0" icon="Update" tooltip="Сбросить данные" class="icon-button" @click="updateData()"></MyIconC>
        </ZoomTransC>
      </div>
      <div class="w3-bar-item padding-2">
        <ZoomTransC>
          <MyIconC v-if="graphDataLength > 0" icon="Delete" tooltip="Очистить" class="icon-button" @click="clearData()"></MyIconC>
        </ZoomTransC>
      </div>
    </div>
    <div>
      <GraphSettingsModeC></GraphSettingsModeC>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GraphData } from '@/components/j1939/components/Graph/GraphDataClass'
const graphDataLength = GraphData.graphListLength
const clearData = () => GraphData.resetAllData()
const updateData = () => GraphData.clearGraphData()
</script>
