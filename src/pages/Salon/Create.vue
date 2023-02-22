<script setup lang="ts">
import _ from "lodash";
import { reactive, ref, provide } from "vue";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Preview from "../../base-components/Preview";
import TomSelect from "../../base-components/TomSelect";
import { ClassicEditor } from "../../base-components/Ckeditor";
import Alert from "../../base-components/Alert";
import Lucide from "../../base-components/Lucide";
import axios from "axios";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import {
  FormInput,
  FormInline,
  FormSelect,
  FormLabel,
  FormHelp,
  FormCheck,
  InputGroup,
  FormSwitch,
} from "../../base-components/Form";

let data = {
  name: "",
  phone: "",
  password: "",
  salon_name: "",
  salon_phone: "",
  salon_address: "",
};

var err = ref([]);
var showPassword = ref(true) ;

// Success notification
const errorNotification = ref<NotificationElement>();

const saveSalon = () => {
  submit();
};
const saveNew = () => {};

const submit = () => {
  axios
    .post("http://dev.api.booking.kendemo.com:3008/api/v1/salon/sign-up", data)
    .then(function (response) {
      // handle success
      console.log(response.data.data);
    })
    .catch(function (error) {
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
    });
};
provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el;
});
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Thêm Mới Salon</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6">
    <div class="col-span-11 intro-y 2xl:col-span-9">
      <!-- BEGIN: Account Info -->
      <div class="p-5 mt-5 intro-y box">
        <div
          class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400"
        >
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="User" class="w-4 h-4 mr-2" /> Thông tin tài khoản
          </div>
          <div class="mt-5">
            <div>
              <FormLabel htmlFor="crud-form-1">Tên chủ salon</FormLabel>
              <FormInput
                id="crud-form-1"
                type="text"
                class="w-full"
                placeholder="Tên chủ salon"
                v-model="data.name"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Số điện thoại</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                v-model="data.phone"
                class="w-full"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-3">Mật Khẩu</FormLabel>
              
              <InputGroup v-if="!showPassword">
                <FormInput
                id="crud-form-3"
                type="text"
                v-model="data.password"
                class="w-full"
                placeholder="Mật Khẩu"
                />
               
                <InputGroup.Text id="input-group-1"  style="cursor: pointer;"  @click="showPassword = !showPassword">
                  <Lucide icon="Eye" />
                </InputGroup.Text>
              </InputGroup> 
              <InputGroup v-else>
                <FormInput
                id="crud-form-3"
                type="password"
                v-model="data.password"
                class="w-full"
                placeholder="Mật Khẩu"
                />
                <InputGroup.Text id="input-group-1"  style="cursor: pointer;" @click="showPassword = !showPassword">
                  <Lucide icon="EyeOff" />
                </InputGroup.Text>
              </InputGroup>
            </div>

          </div>
        </div>
      </div>
      <!-- END: Account Info -->
      <!-- BEGIN: Salon Info -->
      <div class="p-5 mt-5 intro-y box">
        <div
          class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400"
        >
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="User" class="w-4 h-4 mr-2" /> Thông tin Salon
          </div>
          <div class="mt-5">
            <div>
              <FormLabel htmlFor="crud-form-1">Tên Salon</FormLabel>
              <FormInput
                id="crud-form-1"
                type="text"
                class="w-full"
                placeholder="Tên chủ salon"
                v-model="data.salon_name"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Số điện thoại liên hệ</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                v-model="data.phone"
                class="w-full"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-3">Mật Khẩu</FormLabel>
              
              <InputGroup v-if="!showPassword">
                <FormInput
                id="crud-form-3"
                type="text"
                v-model="data.password"
                class="w-full"
                placeholder="Mật Khẩu"
                />
               
                <InputGroup.Text id="input-group-1"  style="cursor: pointer;"  @click="showPassword = !showPassword">
                  <Lucide icon="Eye" />
                </InputGroup.Text>
              </InputGroup> 
              <InputGroup v-else>
                <FormInput
                id="crud-form-3"
                type="password"
                v-model="data.password"
                class="w-full"
                placeholder="Mật Khẩu"
                />
                <InputGroup.Text id="input-group-1"  style="cursor: pointer;" @click="showPassword = !showPassword">
                  <Lucide icon="EyeOff" />
                </InputGroup.Text>
              </InputGroup>
            </div>

          </div>
        </div>
      </div>
      <!-- END: Salon Info -->

      <div class="flex flex-col justify-end gap-2 mt-5 md:flex-row">
        <Button
          type="button"
          class="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
        >
          Cancel
        </Button>
        <Button
          type="button"
          class="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
          @click="saveNew"
        >
          Save & Add New Product
        </Button>
        <Button
          variant="primary"
          type="button"
          class="w-full py-3 md:w-52"
          @click="saveSalon"
        >
          Save
        </Button>
      </div>
    </div>
  </div>
  <div class="p-5">
    <!-- BEGIN: Success Notification -->
    <Notification refKey="errorNotification" class="flex">
      <Lucide icon="AlertTriangle" class="text-success" style="color: red" />
      <div class="ml-4 mr-4">
        <div class="font-medium">Có lỗi xảy ra!</div>
        <div class="mt-1 text-slate-500">
          {{ err }}
        </div>
      </div>
    </Notification>
    <!-- END: Success Notification -->
  </div>
</template>
