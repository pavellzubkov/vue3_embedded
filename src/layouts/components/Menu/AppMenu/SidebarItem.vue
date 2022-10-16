<template>
  <div :class="`${menuClass} ${item.children && item.children.length > 1 ? 'menu-sub-parent' : ''}`" v-if="!item.meta.hidden">
    <div class="menu-item" @click="menuClicked">
      <MyIconC :icon="curItem.meta.icon"></MyIconC>
      <label class="menu-label">{{ curItem.meta.title }}</label>
    </div>
    <transition
      name="flip-list"
      tag="div"
      enter-active-class="animate__animated animate__slideInLeft animate__faster"
      leave-active-class="animate__animated animate__slideOutLeft animate__faster"
    >
      <div v-if="!item.meta.hidden && item.children && item.children.length > 1 && subVis" class="menu-sub">
        <SidebarItem v-for="child in item.children" :key="child.path" :item="child" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import type { IMyRouteRecBase, ImyRouteRecordRaw } from '@/router/router'
import { RouterService } from '@/router/RouterServiceClass'
import { onMounted, PropType, Ref, ref } from 'vue'

const props = defineProps({
  // route object
  item: {
    type: Object as PropType<ImyRouteRecordRaw>,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

console.debug('SidebarItem created ', props)
const curItemFromParent = (parent: IMyRouteRecBase): IMyRouteRecBase => {
  if (!parent.children || parent.children.length === 0) return parent

  const availableChildren = parent.children.filter((item: IMyRouteRecBase) => {
    return !item.meta?.hidden
  })

  if (availableChildren.length === 1) {
    return availableChildren[0]
  }

  return parent
}
const curItem: Ref<IMyRouteRecBase> = ref(curItemFromParent(props.item))
const subVis = ref(false)
const menuClass = ref('w3-bar-item padding-2 w3-hover-theme')
const menuClicked = () => {
  if (curItem.value.children && curItem.value.children?.length > 1) {
    subVis.value = !subVis.value

    menuClass.value = subVis.value ? 'w3-bar-item padding-2' : 'w3-bar-item padding-2 w3-hover-theme'
  } else {
    console.log('go to ', curItem.value.name)
    RouterService.goToName(curItem.value.name)
  }
}

onMounted(() => {
  console.log('Sidebar item mounted', props.item)
})
</script>
<style lang="scss" scoped>
.menu-item {
  display: inline-flex;
  align-items: baseline;
  align-content: baseline;
  width: 100%;
  cursor: pointer;
  margin-left: 4px;
  .menu-label {
    align-self: self-end;
    font-size: 1.2em;
    margin-left: 8px;
    cursor: pointer;
  }
}
.menu-sub {
  position: relative;
  margin-left: 4px;
}
.menu-sub-parent {
  width: 99%;
  box-shadow: var(--color-shadow) 0 2px 4px, var(--color-shadow1) 0 2px 4px -1px, var(--color-shadow2) 0 -1px 0 inset;
}
</style>
