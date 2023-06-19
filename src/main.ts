import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";
import { vMaska } from "maska"
import VueGoogleMaps from '@fawmi/vue-google-maps'
import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_APP_API_LIVE
axios.defaults.headers.common['Authorization'] = "Bearer: " + localStorage.getItem("access_token")
axios.defaults.headers.common['lang'] = 'vi'

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
        localStorage.removeItem("access_token");
        router.push({ name: 'login', query: { err: 1 } })
    }
    return Promise.reject(error);
});

createApp(App).directive("maska", vMaska).use(VueGoogleMaps, {
    load: {
        key: import.meta.env.VITE_GOOGLE_SECRET_KEY,
        libraries: "places",
        language: 'en',
    },
})
    .use(router).use(createPinia()).mount('#app')