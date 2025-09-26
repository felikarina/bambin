import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/variables.css";
import VueLazyload from "vue-lazyload";
import error404Img from "./assets/erreur-404.jpg";
import loadingImg from "./assets/loading.jpg";
import disableDemo from "./utils/v-disable-demo";

const app = createApp(App);

app.use(router);

app.use(VueLazyload, {
  error: error404Img,
  loading: loadingImg,
});

app.directive("disable-demo", disableDemo);

app.mount("#app");

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // noop
    });
  });
}
