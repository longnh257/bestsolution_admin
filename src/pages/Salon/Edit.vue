<script setup lang="ts">
import _, { forEach } from "lodash";
import { reactive, ref, onMounted, provide } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import axios from "axios";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Table from "../../base-components/Table";
import { normalizeInput, getTimeZoneByLocation } from "../../utils/helper";
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
  FormTextarea,
} from "../../base-components/Form";
import moment from 'moment';
import { convertToTZ } from "../../utils/helper";
import VueTimepicker from 'vue3-timepicker/src/VueTimepicker.vue';
import 'vue3-timepicker/dist/VueTimepicker.css'

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


const password = ref("");
const newPassword = ref("");
const newPasswordConfirm = ref("");
let listImgs: any = ref([]);
let listStaffImgs: any = ref([]);
let showPassword = ref(true);
let showPasswordConfirm = ref(true);

const maskedValue = ref("");
const bindedObject = reactive({ unmasked: "" });

const saveSalon = () => {
  submit();
};
const saveNew = () => { };

const submit = () => {

  const fd = new FormData();
  const dateNow = moment().utc().format('YYYY-MM-DD')
  let scheduleData: any = []
  salon.value.schedules.map(item => {
    if (!item.start_time || !item.end_time) {
      scheduleData.push({
        day: item.day,
        start_time: null,
        end_time: null
      })
    } else {
      scheduleData.push({
        day: item.day,
        start_time: item.start_time ? convertToTZ(new Date(`${dateNow} ${item.start_time}`), salon.value.timezone) : null,
        end_time: item.end_time ? convertToTZ(new Date(`${dateNow} ${item.end_time}`), salon.value.timezone) : null
      })
    }
  })
  console.log(scheduleData);


  fd.append("id", salon.value.id);
  fd.append("name", salon.value.name);
  fd.append("address", salon.value.address);
  fd.append("phone", salon.value.phone);
  fd.append("email", salon.value.email ? salon.value.email : '');
  fd.append("description", salon.value.description?salon.value.description:'');
  fd.append("country", salon.value.country);
  fd.append("city", salon.value.city);
  fd.append("state", salon.value.state);
  fd.append("zipcode", salon.value.zipcode);
  fd.append("number_employees", salon.value.number_employees);
  fd.append("timezone", salon.value.timezone);
  fd.append("tz", salon.value.tz);
  fd.append("lat", salon.value.lat);
  fd.append("lng", salon.value.lng);
  fd.append("schedules", JSON.stringify(scheduleData));
  fd.append("delete_images", JSON.stringify(deleteImgArr.value));
  for (let index in images.value) {
    fd.append("images", images.value[index]);
  }


  axios
    .post(`admin/update-salon-info`, fd, {
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

const images = ref([""]);
images.value.splice(0, 1);

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
    salon.value.partner.phone = bindedObject.unmasked;
  }
};

const getAddressData = async (placeResultData: any) => {
  for (const item of placeResultData.address_components) {
    if (item.types.includes("country")) {
      salon.value.country = item.short_name;
    }
    if (item.types.includes("administrative_area_level_1")) {
      salon.value.state = item.short_name;
    }
    if (item.types.includes("administrative_area_level_2")) {
      salon.value.city = item.short_name;
    }
    if (item.types.includes("postal_code")) {
      salon.value.zipcode = item.short_name;
    }
  }
  salon.value.lng = placeResultData.geometry.location.lng();
  salon.value.lat = placeResultData.geometry.location.lat();
  salon.value.address = placeResultData.formatted_address;
  salon.value.tz =
    "UTC " +
    (placeResultData.utc_offset_minutes < 0 ? "" : "+") +
    placeResultData.utc_offset_minutes / 60;
  console.log(salon.value);

  const timezoneByLocation: any = await getTimeZoneByLocation(salon.value.lat, salon.value.lng)
  if (timezoneByLocation.timeZoneId)
    salon.value.timezone = timezoneByLocation.timeZoneId
};
let deleteImgArr = ref<any[]>([]);
const deleteImg = () => {

  deleteImgArr.value.push(selectedImgID.value);
  salon.value.images.splice(selectedImgIndex.value, 1);
  deleteConfirmationModal.value = false;
  console.log(deleteImgArr.value);
};

const getSalon = async () => {
  const response = await axios.get(`salon/${salon_id}`);
  salon.value = response.data.data;
  console.log(salon.value);
};
const changePassword = async () => {
  console.log(newPassword.value, newPasswordConfirm.value);

  await axios.post(`admin/change-password/${salon.value.partner.id}`, {
    new_password: newPassword.value,
    confirm_password: newPasswordConfirm.value,
  }).then(function (response) {
    // handle success     
    scc.value = response.data.message;
    successNotification.value?.showToast();
  })
    .catch(function (error) {
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
    });
};

onMounted(() => {
  getSalon();
});
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Chỉnh sửa Salon</h2>
  </div>
  <div
    class="grid grid-cols-11 pb-20 mt-5 gap-x-6"
    v-if="salon"
  >
    <div class="col-span-11 intro-y 2xl:col-span-9">

      <!-- BEGIN: Salon Info -->
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide
              icon="Home"
              class="w-4 h-4 mr-2"
            /> Thông tin Tài Khoản
          </div>
          <div class="mt-5">
            <div class="mt-3">
              <FormLabel>Số điện thoại</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                placeholder="Số điện thoại dùng để đăng nhập"
                v-model="salon.partner.phone_format"
                disabled="true"
              />
            </div>

            <div class="mt-3">
              <FormLabel htmlFor="crud-form-3">Mật Khẩu Mới</FormLabel>

              <InputGroup v-if="!showPassword">
                <FormInput
                  id="crud-form-3"
                  type="text"
                  v-model="newPassword"
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
                  v-model="newPassword"
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

            <div class="mt-3">
              <FormLabel htmlFor="crud-form-3">Nhập Lại Mật Khẩu Mới</FormLabel>

              <InputGroup v-if="!showPasswordConfirm">
                <FormInput
                  id="crud-form-3"
                  type="text"
                  v-model="newPasswordConfirm"
                  class="w-full"
                  placeholder="Mật Khẩu"
                />

                <InputGroup.Text
                  id="input-group-1"
                  style="cursor: pointer"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                >
                  <Lucide icon="Eye" />
                </InputGroup.Text>
              </InputGroup>
              <InputGroup v-else>
                <FormInput
                  id="crud-form-3"
                  type="password"
                  v-model="newPasswordConfirm"
                  class="w-full"
                  placeholder="Mật Khẩu"
                />
                <InputGroup.Text
                  id="input-group-1"
                  style="cursor: pointer"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                >
                  <Lucide icon="EyeOff" />
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-end gap-2 mt-5 md:flex-row">
          <Button
            variant="primary"
            type="button"
            class="w-full py-3 md:w-52"
            @click="changePassword"
          >
            Lưu
          </Button>
        </div>
      </div>
      <!-- END: Salon Info -->

      <!-- BEGIN: Salon Info -->
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide
              icon="Home"
              class="w-4 h-4 mr-2"
            /> Thông tin Salon
          </div>
          <div class="mt-5">
            <div>
              <FormLabel htmlFor="crud-form-1">Tên Salon</FormLabel>
              <FormInput
                id="crud-form-1"
                type="text"
                class="w-full"
                placeholder="Tên chủ salon"
                v-model="salon.name"
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
                @place_changed="getAddressData"
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
                @change="maskphone(`phone`)"
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
                <div class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                  <div class="grid grid-cols-10 gap-5 pl-4 pr-5">
                    <div
                      v-for="(image, index) in salon.images"
                      :key="image"
                      class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in"
                    >
                      <img
                        class="rounded-md"
                        alt=""
                        :src="image.image"
                      />
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
                      <img
                        class="rounded-md"
                        alt=""
                        :src="image"
                      />
                      <Tippy
                        content="Remove this image?"
                        class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                        @click="revokePreview(index)"
                      >
                        <Lucide
                          icon="X"
                          class="w-4 h-4"
                        />
                      </Tippy>
                    </div>
                  </div>
                  <div class="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer">
                    <Lucide
                      icon="Image"
                      class="w-4 h-4 mr-2"
                    />
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
            <FormLabel
              htmlFor="crud-form-2"
              class="mt-3"
            >Giờ mở cửa</FormLabel>
            <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div
                class="flex"
                v-for="schedule in salon.schedules"
                :key="schedule.id"
              >
                <FormInline class="flex-row flex w-1/2">
                  <FormLabel
                    htmlFor=""
                    class="text-left w-20 mt-3"
                  >
                    {{ schedule.day_name }}
                  </FormLabel>
                  <VueTimepicker v-model="schedule.start_time" />
                </FormInline>
                <FormInline class="flex-row flex w-1/2">
                  <FormLabel
                    htmlFor=""
                    class="text-left w-20 mt-3"
                  >
                    đến
                  </FormLabel>
                  <VueTimepicker v-model="schedule.end_time" />
                </FormInline>
              </div>
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Mô tả về Salon</FormLabel>
              <FormTextarea
                v-model="salon.description"
                class="mt-4"
                aria-placeholder="Thông Tin Giới Thiệu Về Salon"
                rows="6"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-end gap-2 mt-5 md:flex-row">
          <Button
            variant="primary"
            type="button"
            class="w-full py-3 md:w-52"
            @click="saveSalon"
          >
            Lưu
          </Button>
        </div>
      </div>
      <!-- END: Salon Info -->

    </div>
  </div>
  <div class="p-5">
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
        <Lucide
          icon="XCircle"
          class="w-16 h-16 mx-auto mt-3 text-danger"
        />
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
