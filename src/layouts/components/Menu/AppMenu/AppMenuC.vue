<template>
  <div class="w3-bar-block">
    <SidebarItem v-for="route in visibleRoutes" :key="route.path" :item="route" :base-path="route.path" />
    <!--    <div class="w3-bar-item padding-2">-->
    <!--      <div style="display: inline-flex; align-items: baseline; align-content: baseline; width: 100%">-->
    <!--        <MyIconC icon="Files"></MyIconC>-->
    <!--        <label style="align-self: self-end; font-size: 1.2em; margin-left: 8px">Asldkf</label>-->
    <!--      </div>-->

    <!--      <div class="w3-bar-item padding-2 w3-hover-theme" style="display: inline-flex; align-items: baseline; align-content: baseline; width: 100%">-->
    <!--        <MyIconC icon="Files"></MyIconC>-->
    <!--        <label style="align-self: self-end; font-size: 1.2em; margin-left: 8px">Asldkf</label>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts" setup>
import SidebarItem from '@/layouts/components/Menu/AppMenu/SidebarItem.vue'
import { Layout } from '@/layouts/LayoutClass'
import { RouterService } from '@/router/RouterServiceClass'
import { computed, ComputedRef, onMounted } from 'vue'
import { useRoute } from 'vue-router'

console.log('AppMenuC index perm routes', RouterService.acessibleRoutes.value)

const currentRoute = useRoute()

const scrolHeight: ComputedRef<number> = computed(() => Layout.viewRect.value.height)

const sidebarState: ComputedRef<boolean> = Layout.isSidebarCollapsed

const visibleRoutes = computed(() => RouterService.acessibleRoutes.value.filter((r) => !r.meta.hidden))

const activeMenu = (): string => {
  // const route = this.$route
  const { meta, path } = currentRoute
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
}

onMounted(() => {
  console.log('AppMenuC mounted. state -', sidebarState.value)
})
</script>

<style scoped>
.menu-class {
  width: 50px;
}
</style>
