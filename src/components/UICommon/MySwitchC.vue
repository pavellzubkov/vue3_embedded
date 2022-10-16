<template>
  <div>
    <div style="display: inline-flex; justify-content: center; align-items: center">
      <label class="toggle" style="vertical-align: center">
        <input type="checkbox" v-model="checked" @change="change" />
        <span class="slider"></span>
        <span class="labels" :data-on="onstring" :data-off="offstring"></span>
      </label>
      <span style="align-self: flex-start; padding-left: 8px">{{ label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Boolean,
    reqired: true
  },
  onstring: {
    type: String,
    required: false
  },
  offstring: {
    type: String,
    required: false
  },
  label: {
    required: false
  }
})

const emit = defineEmits(['update:modelValue'])
const checked = useVModel(props, 'modelValue', emit)
const change = (event) => {
  checked.value = event.target.checked
}
</script>

<style scoped>
.toggle {
  --width: 40px;
  --height: calc(var(--width) / 2);
  --transition: 0.2s;

  position: relative;
  justify-content: center;
  align-items: center;
  display: inline-flex;
  width: var(--width);
  height: var(--height);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border-radius: var(--height);
  cursor: pointer;
}

.toggle input {
  display: none;
}

.toggle .slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--height);
  background-color: #ccc;
  transition: all var(--transition) ease-in-out;
}

.toggle .slider::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--height));
  height: calc(var(--height));
  border-radius: calc(var(--height) / 2);
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: all var(--transition) ease-in-out;
}

.toggle input:checked + .slider {
  background-color: var(--color-ok);
}

.toggle input:checked + .slider::before {
  transform: translateX(calc(var(--width) - var(--height)));
}

.toggle .labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 12px;
  font-family: sans-serif;
  transition: all var(--transition) ease-in-out;
  overflow: hidden;
}

.toggle .labels::after {
  content: attr(data-off);
  position: absolute;
  right: 5px;
  top: calc(var(--height) * 0.2);
  font-size: calc(var(--height) / 2);
  color: #4d4d4d;
  opacity: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  transition: all var(--transition) ease-in-out;
}

.toggle .labels::before {
  content: attr(data-on);
  position: absolute;
  left: calc(var(--height) - var(--width) + 2px);
  top: calc(var(--height) * 0.2);
  font-size: calc(var(--height) / 2);
  color: #ffffff;

  opacity: 0;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.4);
  transition: all var(--transition) ease-in-out;
}

.toggle input:checked ~ .labels::after {
  opacity: 0;
  transform: translateX(calc(var(--width) - var(--height)));
}

.toggle input:checked ~ .labels::before {
  opacity: 1;
  transform: translateX(calc(var(--width) - var(--height)));
}
</style>
