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
    class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="[
      isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3',
      layout === 'landing' ? 'bg-transparent shadow-none' : '',
      sidebarType
    ]"
  >
    <hr class="mt-0 horizontal dark" />
    <sidenav-list />
  </aside>
</template>

<style scoped>
#sidenav-main.shrunk-parent {
  width: 60px !important;
  border: none !important;
  overflow: hidden;
}
</style>
