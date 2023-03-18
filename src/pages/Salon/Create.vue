<script setup lang="ts">
import _, { forEach } from "lodash";
import { reactive, ref, provide } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import axios from "axios";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Table from "../../base-components/Table";
import { normalizeInput } from "../../utils/helper";
import Tippy from "../../base-components/Tippy";
import ClassicEditor from "../../base-components/Ckeditor/ClassicEditor.vue";

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
import { useSalonCreateStore } from "../../stores/salon-create";
import { log } from "console";

const SalonCreateStore = useSalonCreateStore();
const dt = SalonCreateStore.data;

const services = ref<any[]>([{ name: "", price: "", avatar: "" }]);
const staffs = ref<any[]>([{ name: "", phone: "", avatar: "" }]);
const schedules = ref<any[]>([
  {
    day: 0,
    day_name: "Thứ 2",
    start_time: "08:00",
    end_time: "18:30",
  },
  {
    day: 1,
    day_name: "Thứ 3",
    start_time: "08:00",
    end_time: "18:30",
  },
  {
    day: 2,
    day_name: "Thứ 4",
    start_time: "08:00",
    end_time: "18:30",
  },
  {
    day: 3,
    day_name: "Thứ 5",
    start_time: "08:00",
    end_time: "18:30",
  },
  {
    day: 4,
    day_name: "Thứ 6",
    start_time: "08:00",
    end_time: "18:30",
  },
  {
    day: 5,
    day_name: "Thứ 7",
    start_time: "08:00",
    end_time: "18:30",
  },
  {
    id: 7,
    day: 6,
    day_name: "Chủ nhật",
    start_time: "08:00",
    end_time: "18:30",
  },
]);

const maskedValue = ref("");
const bindedObject = reactive({ unmasked: "" });

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
  salon_country: "",
  salon_state: "",
  salon_city: "",
  salon_zipcode: "",
  salon_timezone: "UTC",
  salon_tz: "",
  salon_lat: "",
  salon_lng: "",
  lang: "en",
  services: services.value,
  staffs: staffs.value,
  schedules: schedules.value,
  images: ref(["file"]),
  fileList: ref(["file"]),
};
data.images.value.splice(0, 1);
data.fileList.value.splice(0, 1);

let listImgs: any = ref([]);
let listStaffImgs: any = ref([]);
let err = ref([]);
let scc = ref([]);
let showPassword = ref(true);

const saveSalon = () => {
  submit();
};

const errorNotification = ref<NotificationElement>();
const successNotification = ref<NotificationElement>();

const submit = () => {
  const fd = new FormData();
  let sArray = <any[]>[];
  for (let index in data.services) {
    if (data.services[index].name !== "" && data.services[index].price !== "") {
      sArray.push(data.services[index]);
    }
  }
  let stArray = <any[]>[];
  for (let index in data.staffs) {
    if (data.staffs[index].name !== "" && data.staffs[index].phone !== "") {
      stArray.push(data.staffs[index]);
    }
  }
  fd.append("name", data.name);
  fd.append("phone", data.phone);
  fd.append("salon_email", data.salon_email);
  fd.append("password", data.password);
  fd.append("salon_name", data.salon_name);
  fd.append("salon_phone", data.salon_phone);
  fd.append("salon_address", data.salon_address);
  fd.append("salon_description", data.salon_description);
  fd.append("salon_country", data.salon_country);
  fd.append("salon_city", data.salon_city);
  fd.append("salon_state", data.salon_state);
  fd.append("salon_zipcode", data.salon_zipcode);
  fd.append("salon_number_employees", data.salon_number_employees);
  fd.append("salon_timezone", data.salon_timezone);
  fd.append("salon_tz", data.salon_tz);
  fd.append("salon_lat", data.salon_lat);
  fd.append("salon_lng", data.salon_lng);
  fd.append("lang", data.lang);
  fd.append("services", JSON.stringify(sArray));
  fd.append("staffs", JSON.stringify(stArray));
  fd.append("schedules", JSON.stringify(data.schedules));

  for (let index in data.images.value) {
    fd.append("images", data.images.value[index]);
  }

  for (let index in data.fileList.value) {
    fd.append("fileList", data.fileList.value[index]);
  }

  axios
    .post(`salon/sign-up`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      // handle success
      scc.value = response.data.message;
      successNotification.value?.showToast();
    })
    .catch(function (error) {
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
    });
};
provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el;
});
provide("bind[successNotification]", (el: NotificationElement) => {
  successNotification.value = el;
});

const previewImages = (e: any) => {
  for (var i = 0; i < e.target.files.length; i++) {
    let file = e.target.files[i];
    data.images.value.push(file);
    listImgs.value.push(URL.createObjectURL(file));
  }
};

const revokePreview = (index: any) => {
  URL.revokeObjectURL(listImgs.value[index]);
  listImgs.value.splice(index, 1);
  data.images.value.splice(index, 1);
};

const previewStaffImages = (e: any) => {
  for (var i = 0; i < e.target.files.length; i++) {
    let file = e.target.files[i];
    data.fileList.value.push(file);
    listStaffImgs.value.push(URL.createObjectURL(file));
  }
};

const revokeStaffPreview = (index: any) => {
  URL.revokeObjectURL(listStaffImgs.value[index]);
  listStaffImgs.value.splice(index, 1);
  data.fileList.value.splice(index, 1);
};

const maskphone = (key: any, isStaff: boolean = false, index: any = null) => {
  if (isStaff) {
    staffs.value[index][key] = bindedObject.unmasked;
  } else {
    if (key === "phone") {
      data.phone = bindedObject.unmasked;
    }
    if (key === "salon_phone") {
      data.salon_phone = bindedObject.unmasked;
    }
  }
};

const getAddressData = ($e: any) => {
  console.log($e.address_components);
  console.log($e);
  console.log($e);
  console.log($e.address_components[0].types);
  for (const item of $e.address_components) {
    if (item.types.includes("country")) {
      data.salon_country = item.short_name;
    }
    if (item.types.includes("administrative_area_level_1")) {
      data.salon_state = item.short_name;
    }
    if (item.types.includes("administrative_area_level_2")) {
      data.salon_city = item.short_name;
    }
    if (item.types.includes("postal_code")) {
      data.salon_zipcode = item.short_name;
    }
  }
  data.salon_lng = $e.geometry.location.lng();
  data.salon_lat = $e.geometry.location.lat();
  data.salon_address = $e.name;
  data.salon_tz =
    "UTC " +
    ($e.utc_offset_minutes < 0 ? "" : "+") +
    $e.utc_offset_minutes / 60;
};
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
              <FormLabel htmlFor="crud-form-1" class="label-require"
                >Tên chủ salon</FormLabel
              >
              <FormInput
                id="crud-form-1"
                type="text"
                class="w-full"
                placeholder="Tên chủ salon"
                v-model="data.name"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2" class="label-require"
                >Số điện thoại</FormLabel
              >
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                placeholder="Số điện thoại dùng để đăng nhập"
                v-maska="bindedObject"
                v-model="maskedValue"
                data-maska="##########"
                @change="maskphone(`phone`)"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-3" class="label-require"
                >Mật Khẩu</FormLabel
              >

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
              <FormLabel htmlFor="crud-form-1" class="label-require"
                >Tên Salon</FormLabel
              >
              <FormInput
                id="crud-form-1"
                type="text"
                class="w-full"
                placeholder="Tên chủ salon"
                v-model="data.salon_name"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2" class="label-require"
                >Địa chỉ salon</FormLabel
              >
              <br />
              <GMapAutocomplete
                id="map"
                class="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 w-full"
                style="
                  padding: 8px 12px;
                  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
                  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                  border-radius: 0.375rem;
                  --tw-border-opacity: 1;
                  border: solid 1px rgb(226 232 240 / var(--tw-border-opacity));
                "
                placeholder="Nhập địa chỉ"
                @place_changed="getAddressData"
              >
              </GMapAutocomplete>
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2" class="label-require"
                >Số điện thoại liên hệ</FormLabel
              >
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                placeholder="Số điện thoại"
                v-maska="bindedObject"
                v-model="maskedValue"
                data-maska="(###) ###-####"
                @change="maskphone(`salon_phone`)"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2" class="label-require"
                >Email</FormLabel
              >
              <FormInput
                id="crud-form-2"
                type="text"
                v-model="data.salon_email"
                class="w-full"
                placeholder="Email"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Ngôn Ngữ</FormLabel>
              <FormSelect
                id="crud-form-2"
                type="text"
                v-model="data.lang"
                class="w-full"
              >
                <option value="en">Tiếng Anh</option>
                <option value="vi">Tiếng Việt</option>
              </FormSelect>
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
            <FormLabel htmlFor="crud-form-2" class="mt-3">Giờ mở cửa</FormLabel>
            <div
              class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400"
            >
              <div
                class="flex"
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
                      v-model="schedule.start_time"
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
                    đến
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
                      v-model="schedule.end_time"
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
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Mô tả về Salon</FormLabel>
              <ClassicEditor
                v-model="data.salon_description"
                class="mt-4"
                aria-placeholder="Thông Tin Giới Thiệu Về Salon"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- END: Salon Info -->

      <!-- BEGIN: service & Service Info -->
      <div class="p-5 mt-5 intro-y box">
        <div class="mb-5">
          <FormLabel htmlFor="" class="text-base font-medium"
            >Hình ảnh Dịch Vụ, Thợ</FormLabel
          >
          <FormInline class="flex-col items-start mt-3 xl:flex-row">
            <div
              class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400"
            >
              <div class="grid grid-cols-10 gap-5 pl-4 pr-5">
                <div
                  v-for="(image, index) in listStaffImgs"
                  :key="image"
                  class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in"
                >
                  <img class="rounded-md" alt="" :src="image" />
                  <Tippy
                    content="Remove this image?"
                    class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                    @click="revokeStaffPreview(index)"
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
                  id="staff-image"
                  type="file"
                  class="absolute top-0 left-0 w-full h-full opacity-0"
                  multiple
                  @change="previewStaffImages"
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
                      <tr
                        class=""
                        v-for="(service, index) in dt.services"
                        :key="index"
                      >
                        <td
                          class="px-5 py-3 border-b dark:border-darkmode-300 !px-2"
                        >
                          <input
                            class="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&amp;[readonly]]:bg-slate-100 [&amp;[readonly]]:cursor-not-allowed [&amp;[readonly]]:dark:bg-darkmode-800/50 [&amp;[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1 min-w-[6rem]"
                            type="text"
                            v-model="service.name"
                          />
                        </td>
                        <td
                          class="px-5 py-3 border-b dark:border-darkmode-300 !px-2"
                        >
                          <input
                            class="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&amp;[readonly]]:bg-slate-100 [&amp;[readonly]]:cursor-not-allowed [&amp;[readonly]]:dark:bg-darkmode-800/50 [&amp;[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1 min-w-[6rem]"
                            type="text"
                            v-model="service.price"
                          />
                        </td>
                        <td
                          class="px-5 py-3 border-b dark:border-darkmode-300 !pl-4 text-slate-500"
                        >
                          <a
                            style="cursor: pointer"
                            @click="SalonCreateStore.deleteService(index)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="stroke-1.5 w-4 h-4"
                              style="margin: 0px auto"
                            >
                              <path d="M3 6h18"></path>
                              <path
                                d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                              ></path>
                              <path
                                d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                              ></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </a>
                        </td>
                      </tr>
                    </Table.Tbody>
                  </Table>
                </div>
                <Button
                  variant="outline-primary"
                  class="w-full mt-4 border-dashed"
                  @click="SalonCreateStore.addService()"
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
                      <tr
                        class=""
                        v-for="(staff, index) in dt.staffs"
                        :key="index"
                      >
                        <td
                          class="px-5 py-3 border-b dark:border-darkmode-300 !px-2"
                        >
                          <input
                            class="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&amp;[readonly]]:bg-slate-100 [&amp;[readonly]]:cursor-not-allowed [&amp;[readonly]]:dark:bg-darkmode-800/50 [&amp;[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1 min-w-[6rem]"
                            type="text"
                            v-model="staff.name"
                          />
                        </td>
                        <td
                          class="px-5 py-3 border-b dark:border-darkmode-300 !px-2"
                        >
                          <input
                            class="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&amp;[readonly]]:bg-slate-100 [&amp;[readonly]]:cursor-not-allowed [&amp;[readonly]]:dark:bg-darkmode-800/50 [&amp;[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1 min-w-[6rem]"
                            type="text"
                            v-model="staff.phone"
                          />
                        </td>
                        <td
                          class="px-5 py-3 border-b dark:border-darkmode-300 !pl-4 text-slate-500"
                        >
                          <a
                            style="cursor: pointer"
                            @click="SalonCreateStore.deleteStaff(index)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="stroke-1.5 w-4 h-4"
                              style="margin: 0px auto"
                            >
                              <path d="M3 6h18"></path>
                              <path
                                d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                              ></path>
                              <path
                                d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                              ></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </a>
                        </td>
                      </tr>
                    </Table.Tbody>
                   
                  </Table>
                </div>
                <Button
                  variant="outline-primary"
                  class="w-full mt-4 border-dashed"
                  @click="SalonCreateStore.addStaff()"
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
        <!-- <Button
          type="button"
          class="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
        >
          Cancel
        </Button> -->
        <!--   <Button
          type="button"
          class="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
          @click="saveNew"
        >
          Save & Add New Product
        </Button> -->
        <Button
          variant="primary"
          type="button"
          class="w-full py-3 md:w-52"
          @click="saveSalon"
        >
          Tạo Salon
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
    <Notification refKey="successNotification" class="flex">
      <Lucide icon="CheckCircle" class="text-success" />
      <div class="ml-4 mr-4">
        <div class="font-medium">Thành Công</div>
        <div class="mt-1 text-slate-500">
          {{ scc }}
        </div>
      </div>
    </Notification>
    <!-- END: Success Notification -->
  </div>
</template>
