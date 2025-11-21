<!--
=========================================================
* Vue Argon Dashboard 2 - v4.0.0
=========================================================

* Product Page: https://creative-tim.com/product/vue-argon-dashboard
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
-->
<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Sidenav from "./examples/Sidenav";
import Configurator from "@/examples/Configurator.vue";

const store = useStore();
const isNavFixed = computed(() => store.state.isNavFixed);
const darkMode = computed(() => store.state.darkMode);
const isAbsolute = computed(() => store.state.isAbsolute);
const showSidenav = computed(() => store.state.showSidenav);
const layout = computed(() => store.state.layout);
const showConfig = computed(() => store.state.showConfig);
const hideConfigButton = computed(() => store.state.hideConfigButton);
const toggleConfigurator = () => store.commit("toggleConfigurator");

</script>
<template>
  <div id="app-wrapper" class="argon-app-wrapper">
    <!-- Landing background (only for landing layout) -->
    <div
      v-show="layout === 'landing'"
      class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
    ></div>

    <!-- Main container with flex layout -->
    <div class="argon-app-container">
      <!-- Sidebar - contained within app -->
      <sidenav v-if="showSidenav" class="argon-sidenav-wrapper" />

      <!-- Main content area -->
      <main class="argon-main-content">
        <router-view />
      </main>
    </div>

    <!-- Configurator (if enabled) -->
    <configurator v-if="showConfig" />
  </div>
</template>

<style>
/* Wrapper to contain everything */
#app-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* Main app container with flex layout */
.argon-app-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fe;
}

/* Sidebar wrapper - constrained width, no fixed positioning */
.argon-sidenav-wrapper {
  flex: 0 0 260px;
  min-width: 260px;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  background-color: #fff;
  border-right: 1px solid #e3e3e3;
}

/* Main content area - takes remaining space */
.argon-main-content {
  flex: 1;
  min-width: 0;
  position: relative;
  overflow-y: auto;
  height: 100vh;
  background-color: #f8f9fe;
}

/* Ensure no overflow breaks layout */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}
</style>