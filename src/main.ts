import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";
import { vMaska } from "maska"
import  VueGoogleMaps from '@fawmi/vue-google-maps'
import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_APP_API
axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("access_token")
axios.defaults.headers.common['lang'] = 'vi'

createApp(App).directive("maska", vMaska).use(VueGoogleMaps, {
    load: {
        key: import.meta.env.VITE_GOOGLE_SECRET_KEY,
        libraries: "places"
    },
})
.use(router).use(createPinia()).mount('#app')