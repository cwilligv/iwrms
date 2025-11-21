<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/logo-ct-dark.png";
import logoWhite from "@/assets/img/logo-ct.png";

const store = useStore();
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
const darkMode = computed(() => store.state.darkMode);
const isRTL = computed(() => store.state.isRTL);
</script>

<template>
  <aside
    id="sidenav-main"
    class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-0"
    :class="[
      layout === 'landing' ? 'bg-transparent shadow-none' : sidebarType,
      isRTL ? 'fixed-end' : 'fixed-start'
    ]"
  >
    <hr class="mt-0 horizontal dark" />
    <sidenav-list />
  </aside>
</template>

<style scoped>
#sidenav-main {
  position: relative !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  flex-shrink: 0;
  overflow-y: auto;
  height: auto;
}

#sidenav-main.shrunk-parent {
  width: 60px !important;
  border: none !important;
  overflow: hidden;
}

/* Remove fixed positioning that causes overlap */
#sidenav-main.fixed-start,
#sidenav-main.fixed-end {
  position: relative !important;
}
</style>