<script setup lang="ts">
import { reactive, ref, provide } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
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
import TomSelect from "../../base-components/TomSelect";

import { useVoucherListStore } from "../../stores/voucher/voucher-list";
import { useVoucherCreateStore } from "../../stores/voucher/voucher-create";
import { useSalonListStore } from "../../stores/salon/salon-list";
import router from "../../router";
import moment from 'moment';

const tags = ref(["1", "2"]);

const SalonListStore = useSalonListStore();
const VoucherListStore = useVoucherListStore();
const VoucherCreateStore = useVoucherCreateStore();
const dt = VoucherCreateStore.data;

SalonListStore.getSalonListApproved()


const bindedObject = reactive({ unmasked: "" });



let PreviewIMG: any = ref("");

const saveVoucher = () => {
  submit();
};

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

const submit = () => {
  VoucherCreateStore.createVoucher().then(function (response) {
    console.log(response.data)

    VoucherCreateStore.resetData()

    scc.value = "Tạo Voucher Thành Công !"
    successNotification.value?.showToast()

    router.push({
      name: 'voucher-list',
    });
  })
    .catch(function (error) {
      console.log(error.response);
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
    });
};


const previewImages = (e: any) => {
  let file = e.target.files[0];
  dt.image = file;
  PreviewIMG.value = URL.createObjectURL(file);
};

const revokePreview = () => {
  URL.revokeObjectURL(PreviewIMG.value);
  PreviewIMG.value = ""
  dt.image = "";
};

</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Thêm Mới Voucher</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6">
    <div class="col-span-11 intro-y 2xl:col-span-9">

      <!-- BEGIN: Voucher Info -->
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide
              icon="User"
              class="w-4 h-4 mr-2"
            /> Thông tin tài khoản
          </div>
          <div class="">
            <div class="grid-cols-2 gap-3 sm:grid">

              <div class="mt-3">
                <FormLabel
                  htmlFor="crud-form-1"
                  class="label-require"
                >Tên voucher</FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  class="w-full"
                  v-model="dt.title"
                />
              </div>

              <div class="mt-3">
                <FormLabel
                  htmlFor="crud-form-1"
                  class="label-require"
                >Mã voucher</FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  class="w-full"
                  v-model="dt.code"
                />
              </div>
            </div>

            <div class="grid-cols-2 gap-3 sm:grid">

              <div class="mt-3">
                <FormLabel
                  htmlFor="crud-form-1"
                  class="label-require"
                >
                  Giá trị
                </FormLabel>
                <InputGroup>
                  <FormInput
                    id="crud-form-4"
                    type="text"
                    v-model="dt.value"
                    aria-describedby="input-group-2"
                  />
                  <InputGroup.Text
                    id="input-group-2"
                    class=" p-0"
                  >
                    <select
                      v-model="dt.type"
                      style="line-height: 20px;border:none !important;"
                    >
                      <option
                        value="1"
                        selected
                      > % </option>
                      <option value="2"> $ </option>
                    </select>
                  </InputGroup.Text>
                </InputGroup>
              </div>

              <div class="mt-3">
                <FormLabel
                  htmlFor="crud-form-1"
                  class="label-require"
                >Loại khách hàng</FormLabel>
                <FormSelect
                  id="crud-form-2"
                  type="text"
                  v-model="dt.type_customer"
                  class="w-full"
                >
                  <option value="1">Tất cả</option>
                  <option value="2">Thường</option>
                  <option value="3">VIP</option>
                </FormSelect>
              </div>
            </div>

            <div class="grid-cols-2 gap-3 sm:grid">
              <div class="mt-3">
                <FormLabel
                  htmlFor="crud-form-1"
                  class="label-require"
                >Ngày Bắt Đầu</FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="date"
                  class="w-full"
                  v-model="dt.start_date"
                />
              </div>

              <div class="mt-3">
                <FormLabel
                  htmlFor="crud-form-1"
                  class="label-require"
                >Ngày Kết Thúc</FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="date"
                  class="w-full"
                  v-model="dt.expiration_date"
                />
              </div>
            </div>

            <div class="mt-3">
              <FormLabel htmlFor="post-form-4">Salon được áp dụng</FormLabel>
              <TomSelect
                id="post-form-4"
                v-model="dt.salon_ids"
                class="w-full"
                multiple
              >
                <option
                  v-for="item in SalonListStore.salons"
                  :key="item.id"
                  :value="item.id"
                > {{"ID: "+item.id + " " + item.name}}</option>
              </TomSelect>
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Hình ảnh</FormLabel>
              <FormInline class="flex-col items-start mt-3 xl:flex-row">
                <div class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                  <div class="grid grid-cols-10 gap-5 pl-4 pr-5">
                    <div
                      v-if="PreviewIMG"
                      class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in"
                    >
                      <img
                        class="rounded-md"
                        alt=""
                        :src="PreviewIMG"
                      />
                      <Tippy
                        content="Remove this image?"
                        class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                        @click="revokePreview()"
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
                      @change="previewImages"
                    />
                  </div>
                </div>
              </FormInline>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Voucher Info -->

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
          @click="saveVoucher"
        >
          Tạo Voucher
        </Button>
      </div>
    </div>
  </div>
  <div class="p-5">
    <!-- BEGIN: Success Notification -->
    <Notification
      refKey="errorNotification"
      :options="{
      duration: 3000,
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
      duration: 3000,
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
