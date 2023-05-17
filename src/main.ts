import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";
import { vMaska } from "maska"
import  VueGoogleMaps from '@fawmi/vue-google-maps'
import axios from "axios"


let API_URL = localStorage.getItem("API_URL")
/* axios.defaults.baseURL = API_URL==import.meta.env.VITE_APP_API_LIVE ? API_URL : import.meta.env.VITE_APP_API_DEV */
axios.defaults.baseURL = import.meta.env.VITE_APP_API_DEV
axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("access_token")
axios.defaults.headers.common['lang'] = 'vi'

createApp(App).directive("maska", vMaska).use(VueGoogleMaps, {
    load: {
        key: import.meta.env.VITE_GOOGLE_SECRET_KEY,
        libraries: "places",
        language:'en'
    },
})
.use(router).use(createPinia()).mount('#app')