<script setup lang="ts">
import { reactive, ref, provide, onMounted, watch,toRef,computed } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
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
} from "../../base-components/Form";
import { SKILLS_NAME } from "../../constant";
import axios from "axios";
import { useRoute } from "vue-router";
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
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { log } from "console";

const route = useRoute();
var salon_id = route.params.salon_id;

const bindedObject = reactive({ unmasked: "" });
const maskedValue = ref();
let listImgs: any = ref([]);
const salon = ref()

let err = ref("");
let scc = ref("");
const errorNotification = ref<NotificationElement>();
const successNotification = ref<NotificationElement>();
provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el;
});
provide("bind[successNotification]", (el: NotificationElement) => {
  successNotification.value = el;
});

const dt = reactive({
  salon_id: salon_id,
  salon_name: "",
  title: "",
  contact_name: "",
  contact_phone: "",
  salon_state: "",
  salon_city: "",
  salon_exists_time: "",
  customer_skin_color: "4",
  gender: "4",
  salary: "",
  salary_form: "1",
  type_salary: "1",
  is_shuttle: "0",
  is_there_house: "0",
  skills: [],
  short_description: "",
  description: "",
  images: <any>[],
})


const validations = {
  title: {
    minLength: helpers.withMessage(
      ({
        $params,
      }) => `Tiêu đề phải có ít nhất  ${$params.min} ký tự`,
      minLength(10)
    ),
    maxLength: helpers.withMessage(
      ({
        $params,
      }) => `Tiêu đề chỉ được có tối đa ${$params.max} ký tự `,
      maxLength(240)
    ),
  },
  salon_name: {
    required: helpers.withMessage(() => 'Vui lòng nhập Tên salon', required),
    minLength: helpers.withMessage(
      ({
        $params,
      }) => `Tên salon phải có ít nhất  ${$params.min} ký tự`,
      minLength(3)
    ),
    maxLength: helpers.withMessage(
      ({
        $params,
      }) => `Tên salon chỉ được có tối đa ${$params.max} ký tự `,
      maxLength(25)
    ),
  },
  contact_name: {
    required: helpers.withMessage(() => 'Vui lòng nhập tên liên hệ', required),
    minLength: helpers.withMessage(
      ({
        $params,
      }) => `Tên liên hệ phải có ít nhất  ${$params.min} ký tự`,
      minLength(3)
    ),
    maxLength: helpers.withMessage(
      ({
        $params,
      }) => `Tên liên hệ chỉ được có tối đa ${$params.max} ký tự `,
      maxLength(25)
    ),
  },
  salon_state: {
    required: helpers.withMessage(() => 'Vui lòng nhập tên tiểu bang', required),
  },
  salon_city: {
    required: helpers.withMessage(() => 'Vui lòng nhập tên thành phố', required),
  },
  salon_exists_time: {
    required: helpers.withMessage(() => 'Vui lòng nhập thời gian tồn tại của salon', required),
    decimal: helpers.withMessage(() => 'Chỉ được nhập số (tối đa 1 chữ số thập phân)', (value: any) => /^(\d+)?(\.\d{1})?$/.test(value)),
  },
  salary: {
    required: helpers.withMessage(() => 'Vui lòng nhập thu nhập trung bình của thợ',requiredIf(() => a.value == 1)),
    decimal: helpers.withMessage(() => 'Chỉ được nhập số (tối đa 2 chữ số thập phân)', (value: any) => /^(\d+)?(\.\d{1,2})?$/.test(value)),
  },
  skills: {
    required: helpers.withMessage(() => 'Vui lòng nhập nhập kinh nghiệm của thợ', required),
  },
};
const validate = useVuelidate(validations, dt)
let a =ref(1)
console.log(a);
watch( () => a.value, (newValue,oldValue) => {
  console.log(newValue,oldValue);
  console.log( a.value);
  validate.value.$touch(); // Mark all fields as touched
  validate.value.$reset(); // Reset previous validation errors
  validate.value.$validate(); // Validate all fields
},   { deep: true, immediate: true } // Watch for deep changes in the object;
)

const getSalon = async () => {
  const response = await axios.get(`salon/${salon_id}`);
  salon.value = response.data.data;

  dt.salon_id = salon_id
  dt.contact_name = salon.value.partner.name
  maskedValue.value = salon.value.partner.phone
  dt.contact_phone = salon.value.partner.phone
  dt.salon_name = salon.value.name
  dt.salon_state = salon.value.state
  dt.salon_city = salon.value.city

};

onMounted(async () => {
  await getSalon();
});



const saveJob = () => {
  submit();
};

const createJob = async () => {
  const fd = new FormData();
  for (let index in dt.images) {
    fd.append("images", dt.images[index]);
  }
  console.log(dt);

  fd.append("salon_name", dt.salon_name);
  fd.append("title", dt.title);
  fd.append("contact_name", dt.contact_name);
  fd.append("contact_phone", dt.contact_phone);
  fd.append("salon_state", dt.salon_state);
  fd.append("salon_city", dt.salon_city);
  fd.append("salon_exists_time", dt.salon_exists_time);
  fd.append("customer_skin_color", dt.customer_skin_color);
  fd.append("salary_form", dt.salary_form);
  fd.append("type_salary", dt.type_salary);
  fd.append("is_shuttle", dt.is_shuttle);
  fd.append("is_there_house", dt.is_there_house);
  fd.append("skills", JSON.stringify(dt.skills));
  fd.append("short_description", dt.short_description);
  fd.append("description", dt.description);

  return await axios
    .post(`admin/create-job/${salon_id}`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
}

const publicJob = async (id: any) => {

  return await axios
    .post(`admin/publish-job`, {
      id: id,
      status: 1
    },)
}

const submit = () => {
  createJob()
    .then(function (response) {
      publicJob(response.data.data.id)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      scc.value = "Tạo Job Thành Công !";
      successNotification.value?.showToast();


    })
    .catch(function (error) {
      console.log(error.response);
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
    });
};

const previewImages = (e: any) => {
  for (var i = 0; i < e.target.files.length; i++) {
    let file = e.target.files[i];
    dt.images.push(file);
    listImgs.value.push(URL.createObjectURL(file));
  }
};

const revokePreview = (index: any) => {
  URL.revokeObjectURL(listImgs.value[index]);
  listImgs.value.splice(index, 1);
  dt.images.splice(index, 1);
};


const maskphone = () => {
  dt.contact_phone = bindedObject.unmasked;
}
const changeCheck = (a:any) => {
  alert(a)
  
}
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Thêm Mới Tin Tuyển Dụng</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6">
    <div class="col-span-11 intro-y 2xl:col-span-9">
      <!-- BEGIN: Job Info -->
      <div
        class="p-5 mt-5 intro-y box"
        v-if="salon"
      >
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">

          <div class="mt-5">
            <FormLabel htmlFor="crud-form-1">
              Tiêu đề
            </FormLabel>
            <FormInput
              id="crud-form-1"
              type="text"
              class="w-full"
              placeholder="Tên salon"
              v-model.trim="validate.title.$model"
              :class="{'border-danger': validate.title.$error,}+'w-full'"
            />

            <template v-if="validate.title.$error">
              <div
                v-for="(error, index) in validate.title.$errors"
                :key="index"
                class="mt-2 text-danger"
              >
                {{ error.$message }}
              </div>
            </template>
            <div class="mt-5 grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-6">
                <FormLabel
                  htmlFor="crud-form-2"
                  class="label-require"
                >
                  Tên liên hệ
                </FormLabel>
                <FormInput
                  id="crud-form-2"
                  type="text"
                  placeholder="Tên liên hệ"
                  v-model="dt.contact_name"
                  disabled
                />
              </div>
              <div class="col-span-6">
                <FormLabel
                  htmlFor="crud-form-2"
                  class="label-require"
                >
                  Tên liên hệ
                </FormLabel>
                <FormInput
                  id="crud-form-2"
                  type="text"
                  placeholder="Tên liên hệ"
                  v-model="dt.contact_phone"
                  disabled
                />
              </div>
            </div>

            <div class="grid-cols-2 gap-6 sm:grid">
              <div class="mt-5">
                <FormLabel htmlFor="crud-form-1">
                  Tên salon
                </FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  class="w-full"
                  placeholder="Tên salon"
                  v-model.trim="validate.salon_name.$model"
                  :class="{'border-danger': validate.salon_name.$error,}+'w-full'"
                />

                <template v-if="validate.salon_name.$error">
                  <div
                    v-for="(error, index) in validate.salon_name.$errors"
                    :key="index"
                    class="mt-2 text-danger"
                  >
                    {{ error.$message }}
                  </div>
                </template>
              </div>

              <div class="mt-5">
                <FormLabel
                  htmlFor="crud-form-2"
                  class="label-require"
                >Số điện thoại liên hệ</FormLabel>
                <FormInput
                  id="crud-form-2"
                  type="text"
                  class="w-full"
                  placeholder="Số điện thoại"
                  v-maska="bindedObject"
                  data-maska="(###) ###-####"
                  v-model="maskedValue"
                  @change="maskphone()"
                />
              </div>
            </div>

            <div class="grid-cols-2 gap-6 sm:grid">
              <div class="mt-5">
                <FormLabel
                  htmlFor="crud-form-2"
                  class="label-require"
                >
                  Tiểu Bang
                </FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  class="w-full"
                  placeholder="Tên salon"
                  v-model.trim="validate.salon_state.$model"
                  :class="{'border-danger': validate.salon_state.$error,}+'w-full'"
                />

                <template v-if="validate.salon_state.$error">
                  <div
                    v-for="(error, index) in validate.salon_state.$errors"
                    :key="index"
                    class="mt-2 text-danger"
                  >
                    {{ error.$message }}
                  </div>
                </template>
              </div>

              <div class="mt-5">
                <FormLabel
                  htmlFor="crud-form-2"
                  class="label-require"
                >
                  Thành phố
                </FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  class="w-full"
                  placeholder="Tên salon"
                  v-model.trim="validate.salon_city.$model"
                  :class="{'border-danger': validate.salon_city.$error,}+'w-full'"
                />

                <template v-if="validate.salon_city.$error">
                  <div
                    v-for="(error, index) in validate.salon_city.$errors"
                    :key="index"
                    class="mt-2 text-danger"
                  >
                    {{ error.$message }}
                  </div>
                </template>
              </div>
            </div>

            <div class="grid-cols-2 gap-6 sm:grid">
              <div class="mt-5">
                <FormLabel class="label-require">
                  Tiệm tồn tại bao lâu?
                </FormLabel>
                <InputGroup :class="{'border-danger': validate.salon_exists_time.$error,}+'w-full'">
                  <FormInput
                    type="text"
                    aria-describedby="input-group-2"
                    v-model.trim="validate.salon_exists_time.$model"
                  />
                  <InputGroup.Text>
                    Năm
                  </InputGroup.Text>
                </InputGroup>
                <template v-if="validate.salon_exists_time.$error">
                  <div
                    v-for="(error, index) in validate.salon_exists_time.$errors"
                    :key="index"
                    class="mt-2 text-danger"
                  >
                    {{ error.$message }}
                  </div>
                </template>
              </div>

              <div class="mt-5">
                <FormLabel>
                  Khách thuộc sắc dân nào?
                </FormLabel>
                <div class="flex flex-col mt-2 sm:flex-row">
                  <FormCheck class="mr-4">
                    <FormCheck.Input
                      id="customer_skin_color-switch-4"
                      type="radio"
                      name="customer_skin_color"
                      value="1"
                      v-model="dt.customer_skin_color"
                    />
                    <FormCheck.Label htmlFor="customer_skin_color-switch-4">
                      Da Trắng
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck class="mt-2 mr-4 sm:mt-0">
                    <FormCheck.Input
                      id="customer_skin_color-switch-5"
                      type="radio"
                      name="customer_skin_color"
                      value="2"
                      v-model="dt.customer_skin_color"
                    />
                    <FormCheck.Label htmlFor="customer_skin_color-switch-5">
                      Da Đen
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck class="mt-2 mr-4 sm:mt-0">
                    <FormCheck.Input
                      id="customer_skin_color-switch-6"
                      type="radio"
                      name="customer_skin_color"
                      value="3"
                      v-model="dt.customer_skin_color"
                    />
                    <FormCheck.Label htmlFor="customer_skin_color-switch-6">
                      Xi
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck class="mt-2 mr-4 sm:mt-0">
                    <FormCheck.Input
                      id="customer_skin_color-switch-7"
                      type="radio"
                      name="customer_skin_color"
                      value="4"
                      v-model="dt.customer_skin_color"
                    />
                    <FormCheck.Label htmlFor="customer_skin_color-switch-7">
                      Tổng hợp
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>
            </div>
            <div class="grid-cols-2 gap-6 sm:grid">
              <div class="mt-5">
                <FormLabel class="label-require">
                  Thu nhập trung bình của thợ
                </FormLabel>
                <InputGroup :class="{'border-danger': validate.salary.$error,}+'w-full'">
                  <FormInput
                    type="number"
                    aria-describedby="input-group-2"
                    v-model.trim="validate.salary.$model"
                  />
                  <InputGroup.Text class=" p-0">
                    <select
                      v-model="dt.type_salary"
                      style="line-height: 20px;border:none !important;"
                    >
                      <option value="1"> $ / Tuần </option>
                      <option value="2"> $ / Tháng </option>
                      <option value="3"> $ / Năm </option>
                    </select>
                  </InputGroup.Text>
                </InputGroup>
                <template v-if="validate.salary.$error">
                  <div
                    v-for="(error, index) in validate.salary.$errors"
                    :key="index"
                    class="mt-2 text-danger"
                  >
                    {{ error.$message }}
                  </div>
                </template>
              </div>

              <div class="mt-5">
                <FormLabel>
                  Cách Tính Lương
                </FormLabel>
                <div class="flex flex-col mt-2 sm:flex-row">
                  <FormCheck class="mr-4">
                    <input
                      id="radio-switch-4"
                      type="radio"
                      name="horizontal_radio_button"
                      value="1"
                      v-model="a"
                      @change="()=> changeCheck(a) "
                    />
                    <FormCheck.Label htmlFor="radio-switch-4">
                      Bao Lương
                    </FormCheck.Label>
                  </FormCheck>

                  <FormCheck class="mt-2 mr-4 sm:mt-0">
                    <input
                      id="radio-switch-5"
                      type="radio"
                      name="horizontal_radio_button"
                      value="2"
                      v-model="a"
                      @change="()=> changeCheck(a) "
                    />
                    <FormCheck.Label htmlFor="radio-switch-5">
                      Ăn Chia 6/4
                    </FormCheck.Label>
                  </FormCheck>

                  <FormCheck class="mt-2 mr-4 sm:mt-0">
                    <input
                      id="radio-switch-6"
                      type="radio"
                      name="horizontal_radio_button"
                      value="3"
                      v-model="a"
                    />
                    <FormCheck.Label htmlFor="radio-switch-6">
                      Thương Lượng
                    </FormCheck.Label>
                  </FormCheck>

                </div>
              </div>
            </div>
            <div class="mt-3 grid-cols-3 gap-6 sm:grid">
              <div class="mt-5">
                <FormLabel>
                  Có Xe Đưa Đón Thợ Không ?
                </FormLabel>
                <div class=" mt-2">
                  <FormCheck class="mt-2">
                    <FormCheck.Input
                      id="shutter-switch2"
                      type="radio"
                      name="shutter-switch"
                      value="1"
                      v-model="dt.is_shuttle"
                    />
                    <FormCheck.Label htmlFor="shutter-switch2">
                      Có
                    </FormCheck.Label>
                  </FormCheck>

                  <FormCheck class="mt-2">
                    <FormCheck.Input
                      id="shutter-switch1"
                      type="radio"
                      name="shutter-switch"
                      value="0"
                      v-model="dt.is_shuttle"
                    />
                    <FormCheck.Label htmlFor="shutter-switch1">
                      Không
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>

              <div class="mt-5">
                <FormLabel>
                  Có nhà cho thợ xuyên bang không?
                </FormLabel>
                <div class="mt-2">
                  <FormCheck class="mt-2">
                    <FormCheck.Input
                      id="is_there_house1"
                      type="radio"
                      name="is_there_house"
                      value="1"
                      v-model="dt.is_there_house"
                    />
                    <FormCheck.Label htmlFor="is_there_house1">
                      Có
                    </FormCheck.Label>
                  </FormCheck>

                  <FormCheck class="mt-2">
                    <FormCheck.Input
                      id="is_there_house"
                      type="radio"
                      name="is_there_house"
                      value="0"
                      v-model="dt.is_there_house"
                    />
                    <FormCheck.Label htmlFor="is_there_house">
                      Không
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>

              <div class="mt-5">
                <label>
                  Tìm Thợ Nam Hay Nữ?
                </label>
                <div class=" ">
                  <FormCheck class="mt-2 mr-5">
                    <FormCheck.Input
                      id="gender-switch"
                      type="radio"
                      name="gender-switch"
                      value="1"
                      v-model="dt.gender"
                    />
                    <FormCheck.Label htmlFor="gender-switch">
                      Nam
                    </FormCheck.Label>
                  </FormCheck>

                  <FormCheck class="mt-2 mr-5">
                    <FormCheck.Input
                      id="gender-switch-1"
                      type="radio"
                      name="gender-switch"
                      value="2"
                      v-model="dt.gender"
                    />
                    <FormCheck.Label htmlFor="gender-switch-1">
                      Nữ
                    </FormCheck.Label>
                  </FormCheck>

                  <FormCheck class="mt-2 mr-5">
                    <FormCheck.Input
                      id="gender-switch-2"
                      type="radio"
                      name="gender-switch"
                      value="4"
                      v-model="dt.gender"
                    />
                    <FormCheck.Label htmlFor="gender-switch-2">
                      Tất Cả
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>
            </div>

            <div class="mt-3 grid-cols-2 gap-6 lg:grid">
              <div class="mt-5">
                <label class="label-require">
                  Tuyển Thợ Có Kinh Nghiệm (Skill) Làm :
                </label>
                <template v-if="validate.skills.$error">
                  <div
                    v-for="(error, index) in validate.skills.$errors"
                    :key="index"
                    class="mt-2 text-danger"
                  >
                    {{ error.$message }}
                  </div>
                </template>
                <div
                  class="flex"
                  style=" flex-flow: wrap;"
                >
                  <FormCheck
                    v-for="(skill,key) in SKILLS_NAME"
                    class="mr-5 mt-3"
                    :key="key"
                  >
                    <input
                      class="transition-all duration-100 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&[type='radio']]:checked:bg-primary [&[type='radio']]:checked:border-primary [&[type='radio']]:checked:border-opacity-10 [&[type='checkbox']]:checked:bg-primary [&[type='checkbox']]:checked:border-primary [&[type='checkbox']]:checked:border-opacity-10 [&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-800/50 [&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-800/50"
                      :id="'skill-'+key"
                      type="checkbox"
                      v-model.trim="validate.skills.$model"
                      :value="key"
                    />
                    <FormCheck.Label :htmlFor="'skill-'+key">
                      {{  skill }}
                    </FormCheck.Label>
                  </FormCheck>

                </div>
              </div>

            </div>

            <div class="mt-5">
              <FormLabel htmlFor="crud-form-2">Nội dung tuyển dụng</FormLabel>
              <ClassicEditor
                v-model="dt.description"
                class="mt-4"
                aria-placeholder="Thông Tin Giới Thiệu Về Job"
              />
            </div>

            <div class="mt-5">
              <FormLabel htmlFor="crud-form-2">Hình ảnh</FormLabel>
              <FormInline class="flex-col items-start mt-3 xl:flex-row">
                <div class="flex-1 w-full pt-4 mt-5 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                  <div class="grid grid-cols-10 gap-6 pl-4 pr-5">
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

          </div>
        </div>
      </div>
      <!-- END: Job Info -->

      <div class="flex flex-col justify-end gap-2 mt-5 md:flex-row">
        <Button
          variant="primary"
          type="button"
          class="w-full py-3 md:w-52"
          @click="saveJob"
        >
          Tạo Job
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
</template>
