<script setup lang="ts">
import _ from "lodash";
import { reactive, ref, provide } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import axios from "axios";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Table from "../../base-components/Table";
import { normalizeInput } from "../../utils/helper";
import Tippy from "../../base-components/Tippy";

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
import { helperNameMap } from "@vue/compiler-core";

let services = ref([{ name: "", price: "", avatar: "" }]);
let staffs = ref([{ name: "", phone: "", avatar: "" }]);
let schedules = ref([
  {
    id: 1,
    day: 0,
    day_name: "Thứ 2",
    start: "08:00",
    end: "18:30",
  },
  {
    id: 2,
    day: 1,
    day_name: "Thứ 3",
    start: "08:00",
    end: "18:30",
  },
  {
    id: 3,
    day: 2,
    day_name: "Thứ 4",
    start: "08:00",
    end: "18:30",
  },
  {
    id: 4,
    day: 3,
    day_name: "Thứ 5",
    start: "08:00",
    end: "18:30",
  },
  {
    id: 5,
    day: 4,
    day_name: "Thứ 6",
    start: "08:00",
    end: "18:30",
  },
  {
    id: 6,
    day: 5,
    day_name: "Thứ 7",
    start: "08:00",
    end: "18:30",
  },
  {
    id: 7,
    day: 6,
    day_name: "Chủ nhật",
    start: "08:00",
    end: "18:30",
  },
]);

const maskedValue = ref('')
const bindedObject = reactive({})

let data = {
  name: "",
  phone: "",
  password: "",
  salon_name: "",
  salon_email: "",
  salon_phone: "",
  salon_address: "",
  salon_description: "",
  salon_number_employees: "",
  salon_country: "US",
  salon_state: "NJ",
  salon_city: "Sayreville",
  salon_zipcode: "",
  salon_timezone: "UTC",
  salon_tz: "UTC +7",
  salon_lat: "34.088808",
  salon_lng: "-118.406125",
  lang: "",
  input_option: "1",
  services: services.value,
  staffs: staffs.value,
  schedules: schedules.value,
  images: [{}],
};

data.images.splice(0, 1);

let listImgs: any = ref([]);
let err = ref([]);
let showPassword = ref(true);

const saveSalon = () => {
  submit();
};
const saveNew = () => {};

const errorNotification = ref<NotificationElement>();
const submit = () => {
  console.log(data);

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

const previewImages = (e: any) => {
  for (var i = 0; i < e.target.files.length; i++) {
    let file = e.target.files[i];
    data.images.push(file);
    listImgs.value.push(URL.createObjectURL(file));
  }
};

const revokePreview = (index: any) => {
  URL.revokeObjectURL(listImgs.value[index]);
  listImgs.value.splice(index, 1);
  data.images.splice(index, 1);
};

const addService = () => {
  services.value.push({ name: "", price: "", avatar: "" });
};

const addStaff = () => {
  staffs.value.push({ name: "", phone: "", avatar: "" });
};

const deleteService = (index: any) => {
  if (services.value.length > 1) {
    services.value.splice(index, 1);
  } else {
    services.value[index].name = "";
    services.value[index].price = "";
  }
};

const deleteStaff = (index: any) => {
  if (staffs.value.length > 1) {
    staffs.value.splice(index, 1);
  } else {
    staffs.value[index].name = "";
    staffs.value[index].phone = "";
  }
};
/* 
const phoneMask  =  (e:any,i:any) => {
  console.log(normalizeInput(staffs.value[i].phone, staffs.value[i].phone));
  
  e.target.value = normalizeInput(staffs.value[i].phone, staffs.value[i].phone)
  console.log(staffs.value);
  
} */
const maskphone = () => {
  data.phone = bindedObject.unmasked  
}
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
                class="w-full"
                placeholder="Số điện thoại"
                v-maska="bindedObject" v-model="maskedValue" data-maska="(###) ###-####" @change="maskphone"
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

                <InputGroup.Text
                  id="input-group-1"
                  style="cursor: pointer"
                  @click="showPassword = !showPassword"
                >
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
                <InputGroup.Text
                  id="input-group-1"
                  style="cursor: pointer"
                  @click="showPassword = !showPassword"
                >
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
            <Lucide icon="Home" class="w-4 h-4 mr-2" /> Thông tin Salon
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
              <FormLabel htmlFor="crud-form-2">Địa chỉ salon</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                v-model="data.salon_address"
                class="w-full"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Số điện thoại liên hệ</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                v-model="data.salon_phone"
                class="w-full"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Email</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                v-model="data.salon_email"
                class="w-full"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Hình ảnh</FormLabel>
              <FormInline class="flex-col items-start mt-3 xl:flex-row">
                <div
                  class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400"
                >
                  <div class="grid grid-cols-10 gap-5 pl-4 pr-5">
                    <div
                      v-for="(image, index) in listImgs"
                      :key="image"
                      class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in"
                    >
                      <img class="rounded-md" alt="" :src="image" />
                      <Tippy
                        content="Remove this image?"
                        class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                        @click="revokePreview(index)"
                      >
                        <Lucide icon="X" class="w-4 h-4" />
                      </Tippy>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer"
                  >
                    <Lucide icon="Image" class="w-4 h-4 mr-2" />
                    <span class="mr-1 text-primary"> Tải lên file</span>
                    <FormInput
                      id="horizontal-form-1"
                      type="file"
                      class="absolute top-0 left-0 w-full h-full opacity-0"
                      multiple
                      @change="previewImages"
                    />
                  </div>
                </div>
              </FormInline>
            </div>
            <div
              class="mt-3 flex"
              v-for="schedule in schedules"
              :key="schedule.id"
            >
              <FormInline class="flex-row flex w-1/2">
                <FormLabel htmlFor="" class="text-left w-20 mt-3">
                  {{ schedule.day_name }}
                </FormLabel>
                <div
                  class="relative w-full"
                  id="timepicker-with-button"
                  data-te-timepicker-init
                  data-te-format24="true"
                  data-te-input-wrapper-init
                >
                  <input
                    type="text"
                    class="peer block min-h-[auto] w-full bg-transparent py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear focus:ring-0 border-0"
                    id="form4"
                    style="border-bottom: 1px solid rgb(226 232 240)"
                    v-model="schedule.start"
                  />
                  <button
                    tabindex="0"
                    type="button"
                    class="timepicker-toggle-button absolute right-2.5 top-1/2 ml-auto h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent fill-neutral-700 outline-none transition-all duration-[300ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:fill-[#3b71ca] focus:fill-[#3b71ca] dark:fill-white dark:hover:fill-[#3b71ca] dark:focus:fill-[#3b71ca]"
                    data-te-toggle="timepicker-with-button"
                    data-te-timepicker-toggle-button
                  >
                    <span data-te-timepicker-icon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-5 w-5 hover:text-[#3b71ca] focus:text-[#3b71ca] dark:text-white dark:hover:text-[#3b71ca] dark:focus:text-[#3b71ca]"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </FormInline>
              <FormInline class="flex-row flex w-1/2">
                <FormLabel htmlFor="" class="text-left w-20 mt-3">
                  Đến
                </FormLabel>
                <div
                  class="relative w-full"
                  id="timepicker-with-button"
                  data-te-timepicker-init
                  data-te-format24="true"
                  data-te-input-wrapper-init
                >
                  <input
                    type="text"
                    class="peer block min-h-[auto] w-full bg-transparent py-[0.32rem] px-3 leading-[2.15] outline-none transition-all duration-200 ease-linear focus:ring-0 border-0"
                    id="form4"
                    style="border-bottom: 1px solid rgb(226 232 240)"
                    v-model="schedule.end"
                  />
                  <button
                    tabindex="0"
                    type="button"
                    class="timepicker-toggle-button absolute right-2.5 top-1/2 ml-auto h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent fill-neutral-700 outline-none transition-all duration-[300ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:fill-[#3b71ca] focus:fill-[#3b71ca] dark:fill-white dark:hover:fill-[#3b71ca] dark:focus:fill-[#3b71ca]"
                    data-te-toggle="timepicker-with-button"
                    data-te-timepicker-toggle-button
                  >
                    <span data-te-timepicker-icon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-5 w-5 hover:text-[#3b71ca] focus:text-[#3b71ca] dark:text-white dark:hover:text-[#3b71ca] dark:focus:text-[#3b71ca]"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </FormInline>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Salon Info -->

      <!-- BEGIN: service & Service Info -->
      <div class="p-5 mt-5 intro-y box">
        <div class="mb-5">
          <FormLabel htmlFor="" class=" text-base font-medium ">Hình ảnh Dịch Vụ, Thợ</FormLabel>
          <FormInline class="flex-col items-start mt-3 xl:flex-row">
            <div
              class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400"
            >
              <div class="grid grid-cols-10 gap-5 pl-4 pr-5">
                <div
                  v-for="(image, index) in listImgs"
                  :key="image"
                  class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in"
                >
                  <img class="rounded-md" alt="" :src="image" />
                  <Tippy
                    content="Remove this image?"
                    class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                    @click="revokePreview(index)"
                  >
                    <Lucide icon="X" class="w-4 h-4" />
                  </Tippy>
                </div>
              </div>
              <div
                class="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer"
              >
                <Lucide icon="Image" class="w-4 h-4 mr-2" />
                <span class="mr-1 text-primary"> Tải lên file</span>
                <FormInput
                  id=""
                  type="file"
                  class="absolute top-0 left-0 w-full h-full opacity-0"
                  multiple
                  @change="previewImages"
                />
              </div>
            </div>
          </FormInline>
        </div>
        <div
          class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400"
        >
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="User" class="w-4 h-4 mr-2" /> Thông tin dịch vụ
          </div>
          <div class="mt-5">
            <FormInline
              class="flex-col items-start mt-5 xl:flex-row first:mt-0 first:pt-0"
            >
              <div class="flex-1 w-full mt-3 xl:mt-0">
                <div class="overflow-x-auto">
                  <Table class="border">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th
                          class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap"
                        >
                          Dịch Vụ
                        </Table.Th>
                        <Table.Th
                          class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap"
                        >
                          Giá Tiền
                        </Table.Th>
                        <Table.Th
                          class="!px-2 bg-slate-50 dark:bg-darkmode-800"
                        ></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr
                        v-for="(service, index) in services"
                        :key="index"
                      >
                        <Table.Td class="!px-2">
                          <FormInput
                            type="text"
                            class="min-w-[6rem]"
                            v-model="service.name"
                          />
                        </Table.Td>
                        <Table.Td class="!px-2">
                          <FormInput
                            type="text"
                            class="min-w-[6rem]"
                            v-model="service.price"
                          />
                        </Table.Td>

                        <Table.Td class="!pl-4 text-slate-500">
                          <a style="cursor: pointer">
                            <Lucide
                              icon="Trash2"
                              class="w-4 h-4"
                              style="margin: 0 auto"
                              @click="deleteService(index)"
                            />
                          </a>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
                <Button
                  variant="outline-primary"
                  class="w-full mt-4 border-dashed"
                  @click="addService"
                >
                  <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Thêm dịch vụ
                </Button>
              </div>
            </FormInline>
          </div>
        </div>
        <div
          class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400 mt-3"
        >
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="User" class="w-4 h-4 mr-2" /> Thông tin thợ
          </div>
          <div class="mt-5">
            <FormInline
              class="flex-col items-start mt-5 xl:flex-row first:mt-0 first:pt-0"
            >
              <div class="flex-1 w-full mt-3 xl:mt-0">
                <div class="overflow-x-auto">
                  <Table class="border">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th
                          class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap"
                        >
                          Tên Thợ
                        </Table.Th>
                        <Table.Th
                          class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap"
                        >
                          Số Điện Thoại
                        </Table.Th>
                        <Table.Th
                          class="!px-2 bg-slate-50 dark:bg-darkmode-800"
                        ></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr v-for="(staff, index) in staffs" :key="index">
                        <Table.Td class="!px-2">
                          <FormInput
                            type="text"
                            class="min-w-[6rem]"
                            v-model="staff.name"
                          />
                        </Table.Td>
                        <Table.Td class="!px-2">
                          <FormInput
                            type="text"
                            class="min-w-[6rem]"
                            v-model="staff.phone"
                          />
                        </Table.Td>

                        <Table.Td class="!pl-4 text-slate-500">
                          <a style="cursor: pointer">
                            <Lucide
                              icon="Trash2"
                              class="w-4 h-4"
                              style="margin: 0 auto"
                              @click="deleteStaff(index)"
                            />
                          </a>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
                <Button
                  variant="outline-primary"
                  class="w-full mt-4 border-dashed"
                  @click="addStaff"
                >
                  <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Thêm Thợ
                </Button>
              </div>
            </FormInline>
          </div>
        </div>
      </div>
      <!-- END: service & Service  Info -->

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
