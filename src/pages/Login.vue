<script setup lang="ts">
import DarkModeSwitcher from "../components/DarkModeSwitcher";
import MainColorSwitcher from "../components/MainColorSwitcher";
import logoUrl from "../assets/images/logo.png";
import illustrationUrl from "../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../base-components/Form";
import Button from "../base-components/Button";
import Notification from "../base-components/Notification";
import { NotificationElement } from "../base-components/Notification";
import axios from "axios";
import { onMounted, ref, provide } from "vue";
import { method } from "lodash";
import Lucide from "../base-components/Lucide";
import router from "../router";
import LoadingIcon from "../base-components/LoadingIcon";
import { useRoute } from "vue-router";

const route = useRoute();

var data = {
  email: "",
  password: "",
};
let loading = ref(false)

let err = ref();
let scc = ref();
const errorNotification = ref<NotificationElement>();
const successNotification = ref<NotificationElement>();
provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el;
});
provide("bind[successNotification]", (el: NotificationElement) => {
  successNotification.value = el;
});


const onSubmit = () => {
  loading.value = true
  axios
    .post("admin/login", {
      email: data.email,
      password: data.password,
    })
    .then(function (response) {
      // handle success
      scc.value = response.data.message;
      successNotification.value?.showToast();
      const access_token = response.data.data.access_token
      localStorage.setItem("access_token", access_token);
      axios.defaults.headers.common['Authorization'] = "Bearer: " + access_token
      router.push(`/salon`);
    })
    .catch(function (error) {
      // handle error
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
      loading.value = false
    });
};

if (route.query.err) {
  err.value = 'Vui lòng đăng nhập';
  setTimeout(() => {
    errorNotification.value?.showToast();
  }, 500)

}
</script>

<template>
  <div :class="[
      '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
      'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
      'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
    ]">
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <a
            href=""
            class="flex items-center pt-5 -intro-x"
          >
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="w-6"
              :src="logoUrl"
            />
            <span class="ml-3 text-lg text-white"> Admin Viet Nail </span>
          </a>
          <div class="my-auto">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="w-1/2 -mt-16 -intro-x"
              :src="logoUrl"
            />
         
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
              Đăng Nhập
            </h2>
          
            <div class="mt-8 intro-x">
              <FormInput
                type="text"
                class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Email"
                v-model="data.email"
                v-on:keyup.enter="onSubmit"
              />
              <FormInput
                type="password"
                class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Mật Khẩu"
                v-model="data.password"
                v-on:keyup.enter="onSubmit"
              />
            </div>
            <div
              v-if="loading"
              class="col-span-12"
            >
              <div class="w-8 mx-auto mt-5">
                <LoadingIcon icon="oval" />
              </div>
            </div>
            <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-center mr-auto">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  class="mr-2 border"
                />
                <label
                  class="cursor-pointer select-none"
                  htmlFor="remember-me"
                >
                  Remember me
                </label>
              </div>
            </div>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button
                variant="primary"
                class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                @click="onSubmit"
              >
                Login
              </Button>
              <!--   <Button
                variant="outline-secondary"
                class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
              >
                Register
              </Button> -->
            </div>
            <!-- <div
              class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left"
            >
              By signin up, you agree to our
              <a class="text-primary dark:text-slate-200" href="">
                Terms and Conditions
              </a>
              &
              <a class="text-primary dark:text-slate-200" href="">
                Privacy Policy
              </a>
            </div> -->
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
  <!-- BEGIN: Success Notification -->
  <Notification
    refKey="errorNotification"
    :options="{
      duration: 5000,
    }"
    class="flex"
  >
    <Lucide
      icon="AlertTriangle"
      class="text-success"
      style="color: red"
    />
    <div class="ml-4 mr-4">
      <div class="font-medium">Có lỗi xảy ra!</div>
      <div class="mt-1 text-slate-500">
        {{ err }}
      </div>
    </div>
  </Notification>
  <Notification
    refKey="successNotification"
    :options="{
      duration: 5000,
    }"
    class="flex"
  >
    <Lucide
      icon="CheckCircle"
      class="text-success"
    />
    <div class="ml-4 mr-4">
      <div class="font-medium">Thành Công</div>
      <div class="mt-1 text-slate-500">
        {{ scc }}
      </div>
    </div>
  </Notification>
  <!-- END: Success Notification -->
</template>
