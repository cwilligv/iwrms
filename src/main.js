import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

// Qalendar imports
import { Qalendar } from "qalendar";
import "qalendar/dist/style.css";

import { setTokens } from '@/services/lightspeedToken';

const app = createApp(App);

// existing plugins
app.use(store);
app.use(router);
app.use(ArgonDashboard);
app.component('v-select', vSelect)
// register Qalendar
app.use(Qalendar);

// DEBUG: confirm the mount element exists
const selector = "#app";
const container = document.querySelector(selector);
console.log(">> Vue mount target:", container);

setTokens({
  access_token:  process.env.VUE_APP_LIGHTSPEED_ACCESS_TOKEN,
  refresh_token: process.env.VUE_APP_LIGHTSPEED_REFRESH_TOKEN,
  expires_in:    3600
});

if (container) {
  app.mount(selector);
} else {
  console.error(`Mount failed... no element matches ${selector}`);
}
