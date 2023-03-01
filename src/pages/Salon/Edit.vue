<script setup lang="ts">
import _, { forEach } from "lodash";
import { reactive, ref, onMounted, provide } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import axios from "axios";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Table from "../../base-components/Table";
import { normalizeInput } from "../../utils/helper";
import Tippy from "../../base-components/Tippy";
import ClassicEditor from "../../base-components/Ckeditor/ClassicEditor.vue";
import { useRoute } from "vue-router";

import Progress from "../../base-components/Progress";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import { Dialog, Menu, Tab } from "../../base-components/Headless";
import { Tab as HeadlessTab } from "@headlessui/vue";

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
import { log } from "console";

const route = useRoute();
var salon_id = route.params.salon_id;

const announcementRef = ref<TinySliderElement>();
const newProjectsRef = ref<TinySliderElement>();
const todaySchedulesRef = ref<TinySliderElement>();
const deleteConfirmationModal = ref(false);
const deleteButtonRef = ref(null);
const selectedImgIndex = ref();
const selectedImgID = ref();
let err = ref([]);
let scc = ref([]);
const salonIndex: any = ref("");
const salonId: any = ref("");
const salon = ref();
const errorNotification = ref<NotificationElement>();
const successNotification = ref<NotificationElement>();
var salon_id = route.params.salon_id;

let listImgs: any = ref([]);
let listStaffImgs: any = ref([]);
let showPassword = ref(true);

const maskedValue = ref("");
const bindedObject = reactive({ unmasked: "" });

const saveSalon = () => {
  submit();
};
const saveNew = () => {};

const fd = new FormData();
const submit = () => {
  console.log(1);
  console.log(localStorage.getItem('access_token'));
  fd.append("id", salon.value.id);
  fd.append("name", salon.value.name);
  fd.append("phone", salon.value.phone);
  fd.append("salon_email", salon.value.salon_email);
  fd.append("password", salon.value.password);
  fd.append("salon_name", salon.value.salon_name);
  fd.append("salon_phone", salon.value.salon_phone);
  fd.append("salon_address", salon.value.salon_address);
  fd.append("salon_description", salon.value.salon_description);
  fd.append("salon_country", salon.value.salon_country);
  fd.append("salon_city", salon.value.salon_city);
  fd.append("salon_state", salon.value.salon_state);
  fd.append("salon_zipcode", salon.value.salon_zipcode);
  fd.append("salon_number_employees", salon.value.salon_number_employees);
  fd.append("salon_timezone", salon.value.salon_timezone);
  fd.append("salon_tz", salon.value.salon_tz);
  fd.append("salon_lat", salon.value.salon_lat);
  fd.append("salon_lng", salon.value.salon_lng);
  fd.append("lang", salon.value.lang);
  fd.append("schedules", JSON.stringify(salon.value.schedules));
  for (let index in images.value) {
    fd.append("images", images.value[index]);
  }

  axios
    .post(`salon/update-salon`, fd, {
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

const images = ref([""])
images.value.splice(0,1)

const previewImages = (e: any) => {
  for (var i = 0; i < e.target.files.length; i++) {
    let file = e.target.files[i];
    images.value.push(file);
    listImgs.value.push(URL.createObjectURL(file));
  }
};

const revokePreview = (index: any) => {
  URL.revokeObjectURL(listImgs.value[index]);
  listImgs.value.splice(index, 1);
  images.value.splice(index, 1);
};

const setDeleteConfirmationModal = (
  value: boolean,
  imgIndex: any = null,
  imgId: any = null
) => {
  deleteConfirmationModal.value = value;
  selectedImgIndex.value = imgIndex;
  selectedImgID.value = imgId;
};

const maskphone = (key: any) => {
  if (key === "phone") {
    salon.value.phone = bindedObject.unmasked;
  }
  if (key === "salon_phone") {
    salon.value.salon_phone = bindedObject.unmasked;
  }
};

const getAddressData = (addressData: any, placeResultData: any, id: any) => {
  /* console.log( placeResultData.address_components);
  console.log( placeResultData);
  console.log( addressData );
  console.log( placeResultData.address_components[0].types); */
  for (const item of placeResultData.address_components) {
    if (item.types.includes("country")) {
      salon.value.salon_country = item.short_name;
    }
    if (item.types.includes("administrative_area_level_1")) {
      salon.value.salon_state = item.short_name;
    }
    if (item.types.includes("administrative_area_level_2")) {
      salon.value.salon_city = item.short_name;
    }
    if (item.types.includes("postal_code")) {
      salon.value.salon_zipcode = item.short_name;
    }
  }
  salon.value.salon_lng = placeResultData.geometry.location.lng();
  salon.value.salon_lat = placeResultData.geometry.location.lat();
  salon.value.salon_address = placeResultData.name;
  salon.value.salon_tz =
    "UTC " +
    (placeResultData.utc_offset_minutes < 0 ? "-" : "+") +
    placeResultData.utc_offset_minutes / 60;
};
let deleteImgArr: any = [];
const deleteImg = () => {
  console.log(1);
  console.log(selectedImgID.value, selectedImgIndex.value);
  deleteImgArr.push(selectedImgID.value);
  salon.value.images.splice(selectedImgIndex.value, 1);
  deleteConfirmationModal.value = false;
  console.log(deleteImgArr);
};

const getSalon = async () => {
  const response = await axios.get(`salon/${salon_id}`, {
    params: {
      page: 1,
    },
   
  });
  salon.value = response.data.data;
  console.log(salon.value);
};

onMounted(() => {
  getSalon();
});
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Thêm Mới Salon</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6" v-if="salon">
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
                v-model="salon.name"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Số điện thoại</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                :placeholder="salon.partner.phone"
                v-maska="bindedObject"
                v-model="maskedValue"
                data-maska="##########"
                @change="maskphone(`phone`)"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-3">Mật Khẩu</FormLabel>

              <InputGroup v-if="!showPassword">
                <FormInput
                  id="crud-form-3"
                  type="text"
                  v-model="salon.password"
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
                  v-model="salon.password"
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
                v-model="salon.partner.name"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Địa chỉ salon</FormLabel>
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
                :placeholder="salon.full_address"
                v-on:placechanged="getAddressData"
              >
              </GMapAutocomplete>
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Số điện thoại liên hệ</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                :placeholder="salon.phone"
                v-maska="bindedObject"
                v-model="maskedValue"
                data-maska="(###) ###-####"
                @change="maskphone(`salon_phone`)"
              />
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Email</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                v-model="salon.email"
                class="w-full"
                placeholder="Email"
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
                      v-for="(image, index) in salon.images"
                      :key="image"
                      class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in"
                    >
                      <img class="rounded-md" alt="" :src="image.image" />
                      <Tippy
                        content="Remove this image?"
                        class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                      >
                        <Lucide
                          icon="X"
                          class="w-4 h-4"
                          @click="
                            setDeleteConfirmationModal(true, index, image.id)
                          "
                        />
                      </Tippy>
                    </div>
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
                v-for="schedule in salon.schedules"
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
                v-model="salon.description"
                class="mt-4"
                aria-placeholder="Thông Tin Giới Thiệu Về Salon"
              />
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
  <!-- BEGIN: Delete Confirmation Modal -->
  <Dialog
    :open="deleteConfirmationModal"
    @close="
      () => {
        setDeleteConfirmationModal(false);
      }
    "
    :initialFocus="deleteButtonRef"
  >
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Xóa?</div>
        <div class="mt-2 text-slate-500">
          Bạn có thật sự muốn xóa hình ảnh nay ?<br />
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
          variant="danger"
          type="button"
          class="w-24 mr-2"
          ref="deleteButtonRef"
          @click="($event) => deleteImg()"
        >
          Xóa
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          @click="
            () => {
              setDeleteConfirmationModal(false);
            }
          "
          class="w-24 mr-1"
        >
          Hủy
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
</template>
