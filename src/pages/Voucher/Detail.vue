<script setup lang="ts">
import _ from "lodash";
import { ref, provide, onMounted } from "vue";
import Button from "../../base-components/Button";
import { FormSwitch, FormInput, FormSelect } from "../../base-components/Form";
import Table from "../../base-components/Table";
import Progress from "../../base-components/Progress";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu, Tab } from "../../base-components/Headless";
import { Tab as HeadlessTab } from "@headlessui/vue";
import { useRoute } from "vue-router";

import { useVoucherDetailStore } from "../../stores/voucher/voucher-detail";
import { VOUCHER_CUSTOMER_TYPE } from "../../constant";

const VoucherDetailStore = useVoucherDetailStore()
VoucherDetailStore.getVoucherDetail()

const imgSliderRef = ref<TinySliderElement>();

provide("bind[imgSliderRef]", (el: TinySliderElement) => {
  imgSliderRef.value = el;
});

const prevNewProjects = () => {
  imgSliderRef.value?.tns.goTo("prev");
};
const nextNewProjects = () => {
  imgSliderRef.value?.tns.goTo("next");
};
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Thông Tin Voucher</h2>
  </div>
  <div
    class="grid grid-cols-12 gap-6 mt-5"
    v-if="!VoucherDetailStore.loading"
  >
    <!-- BEGIN: Profile Menu -->
    <div class="flex flex-col-reverse col-span-12 lg:col-span-5 2xl:col-span-3 lg:block">
      <div class="p-5 rounded-md box">
        <div class="pb-4 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate text-center">Voucher</div>
        </div>
        <div class="flex items-center leading-8">
          <div
            class="px-5"
            v-if="VoucherDetailStore.voucher.image"
          >
            <img
              class="rounded-md mx-auto"
              :alt="VoucherDetailStore.voucher.image"
              :src="VoucherDetailStore.voucher.image"
              style="height: 300px;object-fit: contain;"
            />
          </div>
          <div class="mr-auto 700">
            <strong>Mã Voucher:</strong>
          </div>
          <div class="">
            {{  VoucherDetailStore.voucher.code }}
          </div>
        </div>
        <div class="flex items-center leading-8">
          <div class="mr-auto 700">
            <strong>Giá Trị:</strong>
          </div>
          <div class="text-success">
            - {{VoucherDetailStore.voucher.value}}{{VoucherDetailStore.voucher.type === 1 ? "%" : "$" }}
          </div>
        </div>
        <div class="flex items-center leading-8">
          <div class="mr-auto 700">
            <strong>Ngày áp dụng:</strong>
          </div>
          <div class="">

            {{ VoucherDetailStore.voucher.start_date }}
          </div>
        </div>
        <div class="flex items-center leading-8">
          <div class="mr-auto 700">
            <strong>Ngày kết thúc:</strong>
          </div>
          <div class="">
            {{ VoucherDetailStore.voucher.expiration_date }}
          </div>
        </div>
        <div class="flex items-center leading-8">
          <div class="mr-auto 700">
            <strong>Ngày tạo:</strong>
          </div>
          <div class="">
            {{ VoucherDetailStore.voucher.created_at }}
          </div>
        </div>
        <div class="flex items-center leading-8">
          <div class="mr-auto 700">
            <strong>Loại khách hàng</strong>
          </div>
          <div class="">
            {{ VOUCHER_CUSTOMER_TYPE[VoucherDetailStore.voucher.type_customer] }}
          </div>
        </div>

        <div class="items-center leading-8">
          <div class=" w-full">
            <strong>Nội Dung:</strong>
          </div>
          <div class="w-full">
            {{VoucherDetailStore.voucher.description}}
          </div>
        </div>
      </div>
    </div>
    <!-- END: Profile Menu -->
  </div>
</template>
