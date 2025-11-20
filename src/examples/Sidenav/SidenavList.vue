<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";
import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const collapsed = ref(false);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};

const toggle = () => {
  collapsed.value = !collapsed.value;
  document
    .getElementById("sidenav-main")
    .classList.toggle("shrunk-parent");
};
</script>

<template>
  <div class="d-flex justify-content-end px-2">
    <button class="btn btn-sm btn-outline-primary mb-2" @click="toggle">
      <i :class="collapsed ? 'ni ni-bold-right' : 'ni ni-bold-left'"></i>
    </button>
  </div>

  <div
    :class="['collapse navbar-collapse w-auto h-auto h-100', { shrunk: collapsed }]"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Dashboard'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/Qalendar"
          :class="getRoute() === 'Qalendar' ? 'active' : ''"
          navText="Booking Calendar"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="isRTL ? 'الجداول' : 'Tables'"
        >
          <template v-slot:icon>
            <i class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          {{ isRTL ? 'صفحات المرافق' : 'Customer Search' }}
        </h6>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? 'حساب تعريفي' : 'Customer DB Search'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>

<style scoped>
#sidenav-collapse-main {
  transition: width 0.3s;
}
.shrunk {
  width: 20px !important;
  overflow: hidden;
}
</style>
