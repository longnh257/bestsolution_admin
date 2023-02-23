<script setup lang="ts">
import _ from "lodash";
import { reactive, ref, provide } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import axios from "axios";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Table from "../../base-components/Table";
import {normalizeInput} from "../../utils/helper";
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
let data = {
  images: [{}],
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
  services: "",
  staffs: "",
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
    let file: any = e.target.files[i];
    data.images.push(file);
    listImgs.value.push(URL.createObjectURL(file));
  }
};

const revokePreview = (index: any) => {
  URL.revokeObjectURL(listImgs.value[index]);
  listImgs.value.splice(index, 1);
  data.images.splice(index, 1);
  console.log(data);
};

const addService = () => {
  services.value.push({ name: "", price: "", avatar: "" });
  data.services = JSON.stringify(services);
  console.log(data);
};

const addStaff = () => {
  staffs.value.push({ name: "", phone: "", avatar: "" });
  data.staffs = JSON.stringify(staffs);
  console.log(data);
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
                v-model="data.phone"
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
                    <span class="mr-1 text-primary"> Upload a file </span>
                    or drag and drop
                    <FormInput
                      id="horizontal-form-1"
                      type="file"
                      class="absolute top-0 left-0 w-full h-full opacity-0"
                      @change="previewImages"
                    />
                  </div>
                </div>
              </FormInline>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Salon Info -->

      <!-- BEGIN: service & Service Info -->
      <div class="p-5 mt-5 intro-y box">
        <div
          class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400"
        >
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="User" class="w-4 h-4 mr-2" /> Thông tin dịch vụ
          </div>
          <div class="mt-5">
            <div
              class="flex items-centertext-base font-medium border-slate-200/60 dark:border-darkmode-400"
            >
              <Lucide icon="User" class="w-4 h-4 mr-2" /> Dịch Vụ
            </div>
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
                          <a href="">
                            <Lucide
                              icon="Trash2"
                              class="w-4 h-4"
                              style="margin: 0 auto"
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
                  <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Add New Wholesale
                  Price
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
                          <a href="">
                            <Lucide
                              icon="Trash2"
                              class="w-4 h-4"
                              style="margin: 0 auto"
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
                  <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Thêm Thợ Price
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
