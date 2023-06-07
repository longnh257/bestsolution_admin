<script setup lang="ts">
import { reactive, ref, provide, onMounted } from "vue";
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
  FormSwitch,
} from "../../base-components/Form";
import { SKILLS_NAME } from "../../constant";
import axios from "axios";
import { useRoute } from "vue-router";

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

const dt = ref({
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

const getSalon = async () => {
  const response = await axios.get(`salon/${salon_id}`);
  salon.value = response.data.data;

  dt.value.salon_id = salon_id
  dt.value.contact_name = salon.value.partner.name
  maskedValue.value = salon.value.partner.phone
  dt.value.contact_phone = salon.value.partner.phone
  dt.value.salon_name = salon.value.name
  dt.value.salon_state = salon.value.state
  dt.value.salon_city = salon.value.city

};

onMounted(async () => {
  await getSalon();
});

const saveJob = () => {
  submit();
};

const createJob = async () => {
  const fd = new FormData();
  for (let index in dt.value.images) {
    fd.append("images", dt.value.images[index]);
  }
  console.log(dt.value);

  fd.append("salon_name", dt.value.salon_name);
  fd.append("title", dt.value.title);
  fd.append("contact_name", dt.value.contact_name);
  fd.append("contact_phone", dt.value.contact_phone);
  fd.append("salon_state", dt.value.salon_state);
  fd.append("salon_city", dt.value.salon_city);
  fd.append("salon_exists_time", dt.value.salon_exists_time);
  fd.append("customer_skin_color", dt.value.customer_skin_color);
  fd.append("salary_form", dt.value.salary_form);
  fd.append("type_salary", dt.value.type_salary);
  fd.append("is_shuttle", dt.value.is_shuttle);
  fd.append("is_there_house", dt.value.is_there_house);
  fd.append("skills", JSON.stringify(dt.value.skills));
  fd.append("short_description", dt.value.short_description);
  fd.append("description", dt.value.description);

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
    dt.value.images.push(file);
    listImgs.value.push(URL.createObjectURL(file));
  }
};

const revokePreview = (index: any) => {
  URL.revokeObjectURL(listImgs.value[index]);
  listImgs.value.splice(index, 1);
  dt.value.images.splice(index, 1);
};


const maskphone = () => {
  dt.value.contact_phone = bindedObject.unmasked;
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
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide
              icon="Home"
              class="w-4 h-4 mr-2"
            /> Thông tin
          </div>
          <div class="mt-5">

            <div>
              <FormLabel
                htmlFor="crud-form-2"
                class="label-require"
              >
                Tiêu đề
              </FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                placeholder="Tiêu đề"
                v-model="dt.title"
              />
            </div>

            <div class="mt-5">
              <FormLabel
                htmlFor="crud-form-2"
                class="label-require"
              >
                Tên liên hệ
              </FormLabel>
              <FormInput
                id="crud-form-2"
                type="text"
                class="w-full"
                placeholder="Tên liên hệ"
                v-model="dt.contact_name"
              />
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
                  v-model="dt.salon_name"
                />
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
                  Thành phố
                </FormLabel>
                <FormInput
                  id="crud-form-2"
                  type="text"
                  class="w-full"
                  placeholder="Thành phố cư trú"
                  v-model="dt.salon_city"
                />
              </div>

              <div class="mt-5">
                <FormLabel
                  htmlFor="crud-form-2"
                  class="label-require"
                >
                  Tiểu Bang
                </FormLabel>
                <FormInput
                  id="crud-form-2"
                  type="text"
                  class="w-full"
                  placeholder="Bang cư trú"
                  v-model="dt.salon_state"
                />
              </div>
            </div>

            <div class="grid-cols-2 gap-6 sm:grid">
              <div class="mt-5">
                <FormLabel class="label-require">
                  Tiệm tồn tại bao lâu?
                </FormLabel>
                <InputGroup>
                  <FormInput
                    type="number"
                    v-model="dt.salon_exists_time"
                    aria-describedby="input-group-2"
                    maxlength="3"
                  />
                  <InputGroup.Text>
                    Năm
                  </InputGroup.Text>
                </InputGroup>
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
                <InputGroup>
                  <FormInput
                    type="number"
                    v-model="dt.salary"
                    aria-describedby="input-group-2"
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
              </div>

              <div class="mt-5">
                <FormLabel>
                  Cách Tính Lương
                </FormLabel>
                <div class="flex flex-col mt-2 sm:flex-row">
                  <FormCheck class="mr-4">
                    <FormCheck.Input
                      id="radio-switch-4"
                      type="radio"
                      name="horizontal_radio_button"
                      value="1"
                      v-model="dt.salary_form"
                    />
                    <FormCheck.Label htmlFor="radio-switch-4">
                      Bao Lương
                    </FormCheck.Label>
                  </FormCheck>

                  <FormCheck class="mt-2 mr-4 sm:mt-0">
                    <FormCheck.Input
                      id="radio-switch-5"
                      type="radio"
                      name="horizontal_radio_button"
                      value="2"
                      v-model="dt.salary_form"
                    />
                    <FormCheck.Label htmlFor="radio-switch-5">
                      Ăn Chia 6/4
                    </FormCheck.Label>
                  </FormCheck>

                  <FormCheck class="mt-2 mr-4 sm:mt-0">
                    <FormCheck.Input
                      id="radio-switch-6"
                      type="radio"
                      name="horizontal_radio_button"
                      value="3"
                      v-model="dt.salary_form"
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
                <div
                  class="flex"
                  style=" flex-flow: wrap;"
                >
                  <FormCheck
                    v-for="(skill,key) in SKILLS_NAME"
                    class="mr-5 mt-3"
                    :key="key"
                  >
                    <FormCheck.Input
                      :id="'skill-'+key"
                      type="checkbox"
                      v-model="dt.skills"
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
