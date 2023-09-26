<script setup lang="ts">
import { reactive, ref, provide, toRefs, watch } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Table from "../../base-components/Table";
import { normalizeInput, getTimeZoneByLocation, isImage } from "../../utils/helper";
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
  FormTextarea,
} from "../../base-components/Form";
import { useSalonListStore } from "../../stores/salon/salon-list";
import { useSalonCreateStore } from "../../stores/salon/salon-create";
import Toastify from "toastify-js";
import router from "../../router";
import { Dialog, Menu, Tab } from "../../base-components/Headless";
import {
  required,
  minLength,
  maxLength,
  maxValue,
  minValue,
  email,
  url,
  integer,
  decimal,
  helpers,
  requiredIf,
  alpha,
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import addURL from "../../assets/images/add.png";
import axios from "axios";
import VueTimepicker from 'vue3-timepicker/src/VueTimepicker.vue';
import 'vue3-timepicker/dist/VueTimepicker.css'
const SalonListStore = useSalonListStore();
const SalonCreateStore = useSalonCreateStore();
SalonCreateStore.resetData()
const dt = SalonCreateStore.data;
const bindedObject = reactive({ unmasked: "" });

let listImgs: any = ref([]);
let showPassword = ref(true);
let err = ref("")
let scc = ref("")
const errorNotification = ref<NotificationElement>();
const successNotification = ref<NotificationElement>();
provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el
});
provide("bind[successNotification]", (el: NotificationElement) => {
  successNotification.value = el
});




const maskphone = (key: any, isStaff: boolean = false, index: any = null) => {
  if (isStaff) {
    staffs[index].phone = bindedObject.unmasked;
  } else {
    if (key === "phone") {
      dt.phone = bindedObject.unmasked;
    }
    if (key === "salon_phone") {
      dt.salon_phone = bindedObject.unmasked;
    }
  }
};

const getAddressData = async ($e: any) => {
  for (const item of $e.address_components) {
    if (item.types.includes("country")) {
      dt.salon_country = item.short_name
    }
    if (item.types.includes("administrative_area_level_1")) {
      dt.salon_state = item.short_name
    }
    if (item.types.includes("administrative_area_level_2")) {
      dt.salon_city = item.short_name
    } else {
      dt.salon_city = ""
    }
    if (item.types.includes("postal_code")) {
      dt.salon_zipcode = item.short_name
    }
  }
  if (!dt.salon_city) {
    dt.salon_city = dt.salon_state
  }

  dt.salon_lng = $e.geometry.location.lng();
  dt.salon_lat = $e.geometry.location.lat();
  dt.salon_address = $e.formatted_address;
  dt.salon_tz =
    "UTC " +
    ($e.utc_offset_minutes < 0 ? "" : "+") +
    $e.utc_offset_minutes / 60;
  /*   console.log("salon tz: " + dt.salon_timezone);
    console.log("tz: " + dt.salon_tz); */

  const timezoneByLocation: any = await getTimeZoneByLocation(dt.salon_lat, dt.salon_lng)
  if (timezoneByLocation.timeZoneId)
    dt.salon_timezone = timezoneByLocation.timeZoneId
  console.log("tz: " + dt.salon_timezone);
  console.log(dt);
};

let staff_id = ref(0)
let service_id = ref(0)

const staffs = reactive(
  [
    { staff_id: 0, name: '', phone: '', phone_val: '', avatar: '' },
  ]
);

const services = reactive(
  [
    { service_id: 0, name: '', price: '', avatar: '' },
  ]
);


const scheduleValdiate = (value: any, obj: any) => {
  if (obj.start_time && !obj.end_time)
    return true// Validation passes
  if (obj.start_time > obj.end_time)
    return false; // Validation fails
  return true; // Validation passes
};


const validations = {
  dt: {
    name: {
      required: helpers.withMessage(() => 'Vui lòng nhập tên chủ salon', required)
    },
    phone_val: {
      required: helpers.withMessage(() => 'Vui lòng nhập sđt đăng nhập', required),
      minLength: helpers.withMessage(
        ({
          $params,
        }) => `Số điện thoại phải là 10 số`,
        minLength(10)
      ),
    },
    password: {
      required: helpers.withMessage(() => 'Vui lòng nhập mật khẩu', required),
      regex: helpers.withMessage(() => 'Mật khẩu không được chứa khoảng trắng', (value: any) => /^[^\s]+$/.test(value)),
      minLength: helpers.withMessage(
        ({
          $params,
        }) => `Mật khẩu phải có ít nhất  ${$params.min} ký tự`,
        minLength(6)
      ),
      maxLength: helpers.withMessage(
        ({
          $params,
        }) => `Mật khẩu chỉ được có tối đa ${$params.max} ký tự `,
        maxLength(64)
      ),
    },
    salon_name: {
      required: helpers.withMessage(() => 'Vui lòng nhập tên salon', required)
    },
    salon_address: {
      required: helpers.withMessage(() => 'Địa chỉ salon là bắt buộc, tất cả các thông tin như tiểu bang, thành phố, múi giờ sẽ được lấy từ địa chỉ', required)
    },
    salon_phone_val: {
      required: helpers.withMessage(() => 'Vui lòng nhập sđt salon', required),
      minLength: helpers.withMessage(
        ({
          $params,
        }) => `Số điện thoại phải là 10 số`,
        minLength(14)
      ),
    },
    salon_email: {
      email: helpers.withMessage(() => 'Email không hợp lệ', email),
    },
    salon_description: {
      maxLength: helpers.withMessage(() => 'Mô tả chỉ được nhập tối đa 1000 ký tự', maxLength(1000)),
    },

    schedules: {
      $each: helpers.forEach({
        start_time: {
          required: helpers.withMessage(() => 'Vui lòng nhập giờ mở cửa', requiredIf((val: any, obj: any) => obj.end_time)),
        },
        end_time: {
          required: helpers.withMessage(() => 'Vui lòng nhập giờ đóng cửa', requiredIf((val: any, obj: any) => obj.start_time)),
          scheduleValdiate: helpers.withMessage(() => 'Giờ mở cửa không được lớn hơn giờ đóng cửa', scheduleValdiate),
        },
      }
      )
    },

  },

  staffs: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage(() => 'Vui lòng nhập tên thợ', required),
        minLength: helpers.withMessage(
          ({
            $params,
          }) => `Tên nhân viên phải có ít nhất  ${$params.min} ký tự`,
          minLength(3)
        ),
        maxLength: helpers.withMessage(
          ({
            $params,
          }) => `Tên nhân viên chỉ được có tối đa ${$params.max} ký tự `,
          maxLength(25)
        ),
      },
      phone_val: {
        required: helpers.withMessage(() => 'Vui lòng nhập sđt thợ', required),
        minLength: helpers.withMessage(
          ({
            $params,
          }) => `Số điện thoại phải là 10 số`,
          minLength(14)
        ),
      },
    }
    )
  },

  services: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage(() => 'Vui lòng nhập tên dịch vụ', required),
        minLength: helpers.withMessage(
          ({
            $params,
          }) => `Tên dịch vụ phải có ít nhất  ${$params.min} ký tự`,
          minLength(3)
        ),
        maxLength: helpers.withMessage(
          ({
            $params,
          }) => `Tên dịch vụ chỉ được có tối đa ${$params.max} ký tự `,
          maxLength(25)
        ),
      },
      price: {
        required: helpers.withMessage(() => 'Vui lòng nhập giá dịch vụ', required),
        decimal: helpers.withMessage(() => 'Giá chỉ được nhập số (tối đa 2 chữ số thập phân vd: 9.99)', (value: any) => /^(\d+)?(\.\d{1,2})?$/.test(value)),
        minValue: helpers.withMessage(
          ({
            $params,
          }) => `Giá dịch vụ phải > 0`,
          minValue(0.01)
        ),
        maxValue: helpers.withMessage(
          ({
            $params,
          }) => `Giá dịch vụ phải < 100000`,
          maxValue(99999.99),
        ),
      },
    }
    )
  }

};

const validate = useVuelidate(validations, {
  dt,
  staffs,
  services,
});

const addStaff = () => {
  staff_id.value = staff_id.value + 1
  staffs.push({ staff_id: staff_id.value, name: "", phone: "", phone_val: "", avatar: '' })
}

const addService = () => {
  service_id.value = service_id.value + 1
  services.push({ service_id: service_id.value, name: "", price: "", avatar: '' });
}

const deleteStaff = (id: any) => {
  const i = staffs.findIndex((staff) => staff.staff_id === id);
  if (staffs.length > 1) {
    if (i !== -1) {
      axios
        .post(`upload/delete-avatar`, {
          filename: staffs[i].avatar
        }).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        })
      staffs.splice(i, 1);
      validate.value.$validate()
    }
  } else {
    staffs[i].name = ""
    staffs[i].phone = ""
  }
}


const deleteService = (id: any) => {
  const i = services.findIndex((staff) => staff.service_id === id);
  if (services.length > 1) {
    if (i !== -1) {
      axios
        .post(`upload/delete-avatar`, {
          filename: services[i].avatar
        }).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        })
      services.splice(i, 1)
      validate.value.$validate()
    }
  } else {
    services[i].name = ""
    services[i].price = ""
  }
}


const previewImages = (e: any) => {
  let imgErr = false
  let limErr = false
  for (var i = 0; i < e.target.files.length; i++) {
    let file = e.target.files[i]
    if (isImage(file)) {
      if (dt.images.length < 20) {
        dt.images.push(file)
        listImgs.value.push(URL.createObjectURL(file))
      } else limErr = true
    } else imgErr = true
  }
  if (limErr) {
    err.value = "Chỉ được nhập tối đa 20 hình ảnh"
    errorNotification.value?.showToast();
  }
  if (imgErr) {
    err.value = "Một số file không hợp lệ chỉ được nhập hình ảnh có đuôi jpg, jpeg, png"
    errorNotification.value?.showToast();
  }
};

const revokePreview = (index: any) => {
  URL.revokeObjectURL(listImgs.value[index]);
  listImgs.value.splice(index, 1);
  dt.images.splice(index, 1);
};

const handleFileChange = async (id: any, type: any, event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    const imageFile = files[0];

    const fd = new FormData();
    fd.append('type', type)
    fd.append('avatar', imageFile)
    await axios
      .post(`upload/upload-avatar`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        console.log(res.data.data);
        if (type == 1) {
          const i = staffs.findIndex((staff) => staff.staff_id === id);
          staffs[i].avatar = res.data.data.avatar
        }
        if (type == 2) {
          const i = services.findIndex((service) => service.service_id === id);
          services[i].avatar = res.data.data.avatar
        }
      }).catch((error) => {
        err.value = "Hình ảnh vừa nhập không hợp lệ, vui lòng chỉ nhập hình ảnh có đuôi file jpg,jpeg,png"
        errorNotification.value?.showToast();
      })
  }
}

const saveSalon = () => {
  submit();
};

const submit = () => {
  dt.staffs = staffs
  dt.services = services

  let error = false
  validate.value.$touch()
  if (validate.value.$invalid) {
    error = true
  }

  if (error) {
    err.value = 'Một số thông tin không hợp lệ, vui lòng kiểm tra lại'
    errorNotification.value?.showToast();
    return;
  }


  SalonCreateStore.createSalon().then(function (response: any) {
    if (response.staff_require) {
      err.value = 'Vui lòng nhập ít nhất 1 thợ'
      errorNotification.value?.showToast();
      return;
    }

    if (response.services_require) {
      err.value = 'Vui lòng nhập ít nhất 1 dịch vụ'
      errorNotification.value?.showToast();
      return;
    }
    SalonListStore.approveSalon(response.data.data.admin.id)

    scc.value = "Tạo Salon Thành Công !"
    successNotification.value?.showToast()

    router.push({
      name: 'salon-list',
    });
  })
    .catch(function (error) {
      err.value = error.response.data.message;
      err.value = err.value == 'Trường số điện thoại là bắt buộc' ? 'Trường số điện thoại đăng nhập là bắt buộc' : err.value
      errorNotification.value?.showToast();
    });
};


const copyTimeModal = ref(false);
const sendButtonRef = ref(null);

const setCopyTimeModal = (value: any) => {
  copyTimeModal.value = value;
};


let selectedSchedule = ref({ day: 0, day_name: 'Thứ 2', end_time: '8:00', start_time: '18:30' })
let selectedScheduleIndex = ref(0)

const setSelectedSchedule = (schedule: any, index: any) => {
  selectedScheduleIndex = index
  selectedSchedule.value = schedule
}

let load = ref(false)
const scheduleSeletedList = ref([])

watch(selectedScheduleIndex, (newValue) => {
  selectedSchedule.value = dt.schedules[newValue];
  load.value = true
  setTimeout(() => {
    load.value = false
  }, 1);
});

const copyTime = () => {
  dt.schedules.filter(item => scheduleSeletedList.value.includes(item.day)).map(item => {
    item.start_time = selectedSchedule.value.start_time
    item.end_time = selectedSchedule.value.end_time
  })
  load.value = true
  setTimeout(() => {
    load.value = false
  }, 1);
  setCopyTimeModal(false);
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
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide
              icon="User"
              class="w-4 h-4 mr-2"
            /> Thông tin tài khoản
          </div>

          <div class="mt-5">
            <div>
              <FormLabel class="label-require">Tên chủ salon</FormLabel>
              <FormInput
                id="crud-form-1"
                type="text"
                placeholder="Tên chủ salon"
                v-model.trim="validate.dt.name.$model"
                :class="{'w-full':true,'border-danger': validate.dt.name.$error,}"
              />
              <template v-if="validate.dt.name.$error">
                <div
                  v-for="(error, index) in validate.dt.name.$errors"
                  :key="index"
                  class="mt-2 text-danger"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>

            <div class="mt-3">
              <FormLabel
                htmlFor="crud-form-2"
                class="label-require"
              >Số điện thoại đăng nhập</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                placeholder="Số điện thoại dùng để đăng nhập"
                v-maska="bindedObject"
                data-maska="##########"
                @change="maskphone(`phone`)"
                v-model.trim="validate.dt.phone_val.$model"
                :class="{'w-full':true,'border-danger': validate.dt.phone_val.$error,}"
              />
              <template v-if="validate.dt.phone_val.$error">
                <div
                  v-for="(error, index) in validate.dt.phone_val.$errors"
                  :key="index"
                  class="mt-2 text-danger"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <div class="mt-3">
              <FormLabel
                htmlFor="crud-form-3"
                class="label-require"
              >Mật Khẩu</FormLabel>
              <InputGroup v-if="!showPassword">
                <FormInput
                  id="crud-form-3"
                  type="text"
                  v-model.trim="validate.dt.password.$model"
                  :class="{'w-full':true,'border-danger': validate.dt.password.$error,}"
                  placeholder="Mật Khẩu"
                />

                <InputGroup.Text
                  id="input-group-1"
                  style="cursor: pointer"
                  :class="{'border-danger': validate.dt.password.$error,}"
                  @click="showPassword = !showPassword"
                >
                  <Lucide icon="Eye" />
                </InputGroup.Text>
              </InputGroup>
              <InputGroup v-else>
                <FormInput
                  id="crud-form-3"
                  type="password"
                  v-model.trim="validate.dt.password.$model"
                  :class="{'w-full':true,'border-danger': validate.dt.password.$error,}"
                  placeholder="Mật Khẩu"
                />
                <InputGroup.Text
                  id="input-group-1"
                  style="cursor: pointer"
                  :class="{'border-danger': validate.dt.password.$error,}"
                  @click="showPassword = !showPassword"
                >
                  <Lucide icon="EyeOff" />
                </InputGroup.Text>
              </InputGroup>

              <template v-if="validate.dt.password.$error">
                <div
                  v-for="(error, index) in validate.dt.password.$errors"
                  :key="index"
                  class="mt-2 text-danger"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Account Info -->
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
              <FormLabel
                htmlFor="crud-form-1"
                class="label-require"
              >Tên Salon</FormLabel>
              <FormInput
                id="crud-form-1"
                type="text"
                class="w-full"
                placeholder="Tên chủ salon"
                v-model.trim="validate.dt.salon_name.$model"
                :class="{'w-full':true,'border-danger': validate.dt.salon_name.$error,}"
              />
              <template v-if="validate.dt.salon_name.$error">
                <div
                  v-for="(error, index) in validate.dt.salon_name.$errors"
                  :key="index"
                  class="mt-2 text-danger"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <div class="mt-3">
              <FormLabel
                htmlFor="crud-form-2"
                class="label-require"
              >Địa chỉ salon</FormLabel>
              <br />
              <GMapAutocomplete
                id="map"
                class="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 w-full"
                language="en"
                style="
                  padding: 8px 12px;
                  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
                  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                  border-radius: 0.375rem;
                  --tw-border-opacity: 1;
                  border: solid 1px rgb(226 232 240 / var(--tw-border-opacity));"
                placeholder="Nhập địa chỉ"
                @place_changed="getAddressData"
              >
              </GMapAutocomplete>

              <template v-if="validate.dt.salon_address.$error">
                <div
                  v-for="(error, index) in validate.dt.salon_address.$errors"
                  :key="index"
                  class="mt-2 text-danger"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <div class="mt-3">
              <FormLabel
                htmlFor="crud-form-2"
                class="label-require"
              >Số điện thoại salon</FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                placeholder="Số điện thoại salon"
                v-maska="bindedObject"
                data-maska="(###) ###-####"
                @change="maskphone(`salon_phone`)"
                v-model.trim="validate.dt.salon_phone_val.$model"
                :class="{'w-full':true,'border-danger': validate.dt.salon_phone_val.$error,}"
              />
              <template v-if="validate.dt.salon_phone_val.$error">
                <div
                  v-for="(error, index) in validate.dt.salon_phone_val.$errors"
                  :key="index"
                  class="mt-2 text-danger"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Email</FormLabel>
              <FormInput
                id="crud-form-2"
                type="email"
                class="w-full"
                placeholder="Email"
                v-model.trim="validate.dt.salon_email.$model"
                :class="{'w-full':true,'border-danger': validate.dt.salon_email.$error,}"
              />
              <template v-if="validate.dt.salon_email.$error">
                <div
                  v-for="(error, index) in validate.dt.salon_email.$errors"
                  :key="index"
                  class="mt-2 text-danger"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>

            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Hình ảnh</FormLabel>
              <FormInline class="flex-col items-start mt-3 xl:flex-row">
                <div class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                  <div class="grid grid-cols-10 gap-5 pl-4 pr-5">
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


            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Mô tả về Salon</FormLabel>
              <FormTextarea
                class="mt-4"
                aria-placeholder="Thông Tin Giới Thiệu Về Salon"
                rows="6"
                v-model.trim="validate.dt.salon_description.$model"
                :class="{'w-full':true,'border-danger': validate.dt.salon_description.$error,}"
              />
              <template v-if="validate.dt.salon_description.$error">
                <div
                  v-for="(error, index) in validate.dt.salon_description.$errors"
                  :key="index"
                  class="mt-2 text-danger"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>

            <FormLabel
              htmlFor="crud-form-2"
              class="mt-3"
            >Giờ mở cửa</FormLabel>
            <div
              class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400"
              v-if="!load"
            >
              <div
                class="grid grid-cols-12 gap-4 gap-y-3"
                v-for="(schedule,index) in dt.schedules"
                :key="index"
              >
                <div class="grid grid-cols-12 gap-4 gap-y-3 col-span-12">
                  <FormInline class="col-span-6">
                    <FormLabel
                      htmlFor=""
                      class="text-left w-20 mt-3"
                    >
                      {{ schedule.day_name }}
                    </FormLabel>

                    <VueTimepicker v-model="schedule.start_time" />

                  </FormInline>
                  <FormInline class="col-span-6">
                    <FormLabel
                      htmlFor=""
                      class="text-left w-20 mt-3"
                    >
                      đến
                    </FormLabel>
                    <VueTimepicker v-model="schedule.end_time" />
                  </FormInline>
                </div>
                <!-- BEGIN: Modal Toggle -->
                <div class="text-center col-span-12">
                  <template v-if="validate.dt.schedules.$each.$response.$errors[index].end_time">
                    <div
                      v-for="(error, i) in validate.dt.schedules.$each.$response.$errors[index].end_time"
                      :key="i"
                      class="mt-2 text-danger"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                  <template v-if="validate.dt.schedules.$each.$response.$errors[index].start_time">
                    <div
                      v-for="(error, i) in validate.dt.schedules.$each.$response.$errors[index].start_time"
                      :key="i"
                      class="mt-2 text-danger"
                    >
                      {{ error.$message }}
                    </div>
                  </template>
                </div>
                <div
                  class="text-center col-span-12"
                  v-if="schedule.start_time && schedule.end_time"
                >
                  <a
                    as="a"
                    href="#"
                    variant="primary"
                    @click="(event: MouseEvent) => {
                      event.preventDefault();
                      setSelectedSchedule(schedule,index)
                      setCopyTimeModal(true);
                    }"
                    style="color:#bd45c2"
                  >
                    Sao chép thời gian sang ngày khác
                  </a>
                </div>
                <!-- END: Modal Toggle -->
              </div>
            </div>
           
          </div>
        </div>
      </div>
      <!-- END: Salon Info -->

      <!-- BEGIN: STaffs & Service Info -->
      <div class="p-5 mt-5 intro-y box">

        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400 label-require">
            <Lucide
              icon="User"
              class="w-4 h-4 mr-2 "
            /> Thông tin dịch vụ &nbsp;
          </div>
          <div class="mt-5">
            <FormInline class="flex-col items-start mt-5 xl:flex-row first:mt-0 first:pt-0">
              <div class="flex-1 w-full mt-3 xl:mt-0">
                <div class="overflow-x-auto">
                  <Table class="border">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap w-16">
                          Hình Ảnh
                        </Table.Th>
                        <Table.Th class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap label-require">
                          Dịch Vụ
                        </Table.Th>
                        <Table.Th class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap label-require">
                          Giá Tiền ($)
                        </Table.Th>
                        <Table.Th class="!px-2 bg-slate-50 dark:bg-darkmode-800"></Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <tbody>
                      <tr
                        class=""
                        v-for="(service, key) in services"
                        :key="service.service_id"
                      >
                        <td class="py-3 border-b dark:border-darkmode-300 !px-2 align-top w-16">
                          <input
                            type="file"
                            :key="service.service_id"
                            :id="'service_img'+service.service_id"
                            @change="($event:Event)=> {
                              handleFileChange(service.service_id, 2, $event)
                            }"
                            class="hidden"
                          />
                          <label
                            :for="'service_img'+service.service_id"
                            class="input-img-label"
                          >
                            <img
                              :src="service.avatar?service.avatar:addURL"
                              height="60"
                              width="60"
                            />
                          </label>
                        </td>
                        <td class="py-3 border-b dark:border-darkmode-300 !px-2 align-top">
                          <FormInput
                            id="validation-form-1"
                            v-model="service.name"
                            type="text"
                            name="name"
                            :class="{'border-danger': validate.services.$each.$response.$errors[key].name[0]}"
                          />
                          <template v-if="validate.services.$each.$response.$errors[key].name">
                            <div
                              v-for="(error, index) in validate.services.$each.$response.$errors[key].name"
                              :key="index"
                              class="mt-2 text-danger"
                            >
                              {{ error.$message }}
                            </div>
                          </template>
                        </td>
                        <td class="py-3 border-b dark:border-darkmode-300 !px-2 align-top">
                          <InputGroup>
                            <FormInput
                              id="validation-form-1"
                              v-model="service.price"
                              type="number"
                              step="0.01"
                              :class="{'border-danger': validate.services.$each.$response.$errors[key].price[0]}"
                            />
                            <InputGroup.Text id="input-group-1">
                              $
                            </InputGroup.Text>
                          </InputGroup>
                          <template v-if="validate.services.$each.$response.$errors[key].price">
                            <div
                              v-for="(error, index) in validate.services.$each.$response.$errors[key].price"
                              :key="index"
                              class="mt-2 text-danger"
                            >
                              {{ error.$message }}
                            </div>
                          </template>
                        </td>
                        <td class="px-5 py-3 border-b dark:border-darkmode-300 !pl-4 text-slate-500">
                          <a
                            style="cursor: pointer"
                            @click="()=>{
                              deleteService(service.service_id)
                            }"
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
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line
                                x1="10"
                                y1="11"
                                x2="10"
                                y2="17"
                              ></line>
                              <line
                                x1="14"
                                y1="11"
                                x2="14"
                                y2="17"
                              ></line>
                            </svg>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <Button
                  variant="outline-primary"
                  class="w-full mt-4 border-dashed"
                  @click="addService()"
                >
                  <Lucide
                    icon="Plus"
                    class="w-4 h-4 mr-2"
                  /> Thêm dịch vụ
                </Button>
              </div>
            </FormInline>
          </div>
        </div>
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400 mt-3">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400 ">
            <Lucide
              icon="User"
              class="w-4 h-4 mr-2 "
            /> Thông tin thợ &nbsp;
          </div>
          <div class="mt-5">
            <FormInline class="flex-col items-start mt-5 xl:flex-row first:mt-0 first:pt-0">
              <div class="flex-1 w-full mt-3 xl:mt-0">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border">
                    <thead>
                      <Table.Tr>
                        <Table.Th class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap w-16">
                          Hình Ảnh
                        </Table.Th>
                        <Table.Th class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap label-require">
                          Tên Thợ
                        </Table.Th>
                        <Table.Th class="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap label-require">
                          Số Điện Thoại
                        </Table.Th>
                        <Table.Th class="!px-2 bg-slate-50 dark:bg-darkmode-800"></Table.Th>
                      </Table.Tr>
                    </thead>
                    <tbody>
                      <tr
                        class=""
                        v-for="(staff, key) in staffs"
                        :key="staff.staff_id"
                      >
                        <td class="py-3 border-b dark:border-darkmode-300 !px-2 align-top w-16">
                          <input
                            type="file"
                            :key="staff.staff_id"
                            :id="'staff_img'+staff.staff_id"
                            @change="($event:Event)=> {
                              handleFileChange(staff.staff_id, 1, $event)
                            }"
                            class="hidden"
                          />
                          <label
                            :for="'staff_img'+staff.staff_id"
                            class="input-img-label"
                          >
                            <img
                              :src="staff.avatar?staff.avatar:addURL"
                              height="60"
                              width="60"
                            />
                          </label>
                        </td>
                        <td class="py-3 border-b dark:border-darkmode-300 !px-2 align-top">
                          <FormInput
                            id="validation-form-1"
                            v-model="staff.name"
                            type="text"
                            name="name"
                            :class="{'border-danger': validate.staffs.$each.$response.$errors[key].name[0]}"
                          />
                          <template v-if="validate.staffs.$each.$response.$errors[key].name">
                            <div
                              v-for="(error, index) in validate.staffs.$each.$response.$errors[key].name"
                              :key="index"
                              class="mt-2 text-danger"
                            >
                              {{ error.$message }}
                            </div>
                          </template>
                        </td>
                        <td class="py-3 border-b dark:border-darkmode-300 !px-2 align-top">
                          <input
                            class="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&amp;[readonly]]:bg-slate-100 [&amp;[readonly]]:cursor-not-allowed [&amp;[readonly]]:dark:bg-darkmode-800/50 [&amp;[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1 min-w-[6rem]"
                            type="text"
                            v-maska="bindedObject"
                            data-maska="(###) ###-####"
                            v-model="staff.phone_val"
                            @change="maskphone('',true,key)"
                            :class="{'border-danger': validate.staffs.$each.$response.$errors[key].phone_val[0],
                            'border-slate-200':!validate.staffs.$each.$response.$errors[key].phone_val[0],}"
                          />
                          <template v-if="validate.staffs.$each.$response.$errors[key].phone_val[0]">
                            <div
                              v-for="(error, index) in validate.staffs.$each.$response.$errors[key].phone_val"
                              :key="index"
                              class="mt-2 text-danger"
                            >
                              {{ error.$message }}
                            </div>
                          </template>
                        </td>
                        <td class="px-5 py-3 border-b dark:border-darkmode-300 !pl-4 text-slate-500">
                          <a
                            style="cursor: pointer"
                            @click="deleteStaff(staff.staff_id)"
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
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line
                                x1="10"
                                y1="11"
                                x2="10"
                                y2="17"
                              ></line>
                              <line
                                x1="14"
                                y1="11"
                                x2="14"
                                y2="17"
                              ></line>
                            </svg>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button
                  variant="outline-primary"
                  class="w-full mt-4 border-dashed"
                  @click="addStaff()"
                >
                  <Lucide
                    icon="Plus"
                    class="w-4 h-4 mr-2"
                  /> Thêm Thợ
                </Button>
              </div>
            </FormInline>
          </div>
        </div>
      </div>
      <!-- END: STaffs & Service  Info -->

      <div class="flex flex-col justify-end gap-2 mt-5 md:flex-row">
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

  <!-- BEGIN:Copy Time Modal Content -->
  <Dialog
    :open="copyTimeModal"
    @close="
                  () => {
                    setCopyTimeModal(false);
                  }
                "
    :initialFocus="sendButtonRef"
  >
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          Chọn ngày muốn sao chép
        </h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12 ">
          <FormSelect v-model="selectedScheduleIndex">
            <option
              v-for="(schedule,index) in dt.schedules"
              :key="index"
              :value="index"
            > {{ schedule.day_name }}</option>
          </FormSelect>
        </div>
        <div
          class="col-span-6 "
          v-if="!load"
        >
          <FormInline class="flex-row">
            <FormLabel
              htmlFor=""
              class="text-left mt-3"
            >
              Từ
            </FormLabel>
            <VueTimepicker
              v-model="selectedSchedule.start_time"
              id="start_time"
            />
          </FormInline>

        </div>
        <div
          class="col-span-6 "
          v-if="!load"
        >
          <FormInline class="flex-row">
            <FormLabel
              htmlFor=""
              class="text-left mt-3"
            >
              đến
            </FormLabel>
            <VueTimepicker
              v-model="selectedSchedule.end_time"
              id="end_time"
            />
          </FormInline>

        </div>
        <div class="col-span-12 ">
          <template v-if="validate.dt.schedules.$each.$response.$errors[selectedScheduleIndex].start_time">
            <div
              v-for="(error, i) in validate.dt.schedules.$each.$response.$errors[selectedScheduleIndex].start_time"
              :key="i"
              class="mt-2 text-danger"
            >
              {{ error.$message }}
            </div>
          </template>
          <template v-if="validate.dt.schedules.$each.$response.$errors[selectedScheduleIndex].end_time">
            <div
              v-for="(error, i) in validate.dt.schedules.$each.$response.$errors[selectedScheduleIndex].end_time"
              :key="i"
              class="mt-2 text-danger"
            >
              {{ error.$message }}
            </div>
          </template>
        </div>
        <div class="col-span-12 ">
          <b>Chọn ngày áp dụng</b>
          <div class="col-span-12 ">
            <div
              class="flex items-center mr-4 mt-3"
              v-for="(schedule,index) in dt.schedules.filter(item=>item.day!=dt.schedules[selectedScheduleIndex].day)"
              :key="index"
            >
              <label
                class="mr-auto transition-all duration-100 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&[type='radio']]:checked:bg-primary [&[type='radio']]:checked:border-primary [&[type='radio']]:checked:border-opacity-10 [&[type='checkbox']]:checked:bg-primary [&[type='checkbox']]:checked:border-primary [&[type='checkbox']]:checked:border-opacity-10 [&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-800/50 [&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-800/50"
                :htmlFor="'customer_skin_color-switch-'+index"
              >
                {{ schedule.day_name}}
              </label>
              <input
                class=" ml-auto transition-all duration-100 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&[type='radio']]:checked:bg-primary [&[type='radio']]:checked:border-primary [&[type='radio']]:checked:border-opacity-10 [&[type='checkbox']]:checked:bg-primary [&[type='checkbox']]:checked:border-primary [&[type='checkbox']]:checked:border-opacity-10 [&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-800/50 [&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-800/50"
                :id="'customer_skin_color-switch-'+index"
                type="checkbox"
                v-model="scheduleSeletedList"
                :value="schedule.day"
              />
            </div>
          </div>
        </div>

      </Dialog.Description>
      <Dialog.Footer>
        <Button
          type="button"
          variant="outline-secondary"
          @click="
                        () => {
                          setCopyTimeModal(false);
                        }
                      "
          class="w-20 mr-1"
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          type="button"
          class="w-32"
          ref="{sendButtonRef}"
          @click="copyTime()"
        >
          Sao Chép
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Content -->
</template>
