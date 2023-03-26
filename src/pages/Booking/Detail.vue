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


import { useBookingDetailStore } from "../../stores/booking/booking-detail";

const BookingDetailStore = useBookingDetailStore()
BookingDetailStore.getBookingDetail()

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
    <h2 class="mr-auto text-lg font-medium">Thông Tin Booking</h2>
  </div>
  <div
    class="grid grid-cols-12 gap-6 mt-5"
    v-if="!BookingDetailStore.loading"
  >
    <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
      <!-- BEGIN: Projects -->
      <div class="col-span-12 intro-y box 2xl:col-span-6">
        <div class="flex items-center px-5 py-3 border-b border-slate-200/60 dark:border-darkmode-400">
          <h2 class="mr-auto text-base font-medium">Hình Ảnh Booking</h2>
        </div>
        <TinySlider
          refKey="imgSliderRef"
          class="py-5"
        >
          <div
            class="px-5"
            v-for="item in BookingDetailStore.booking.images"
            :key="item.id"
          >
            <img
              class="rounded-md"
              :alt="item.created_at"
              :src="item.image"
            />
          </div>
        </TinySlider>
      </div>
      <!-- END: Projects -->
      <!-- BEGIN: Product Information -->
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            Chi Tiết
          </div>
          <div
            class="mt-2"
            style="font-size: 15px; line-height: 2rem"
          >
          <div class="text-left">
              <div class="flex items-center">
                <div
                  class="font-semibold mr-auto"
                  style="min-width: fit-content"
                >
                  Khách hàng:
                </div>
                <strong class=" mr-3">
                  {{ BookingDetailStore.booking.customer.name }}
                </strong>
              </div>
            </div>
            <div class="text-left">
              <div class="flex items-center">
                <div
                  class="font-semibold mr-auto"
                  style="min-width: fit-content"
                >
                  Tên Salon :
                </div>
                <span class=" mr-3">
                  {{ BookingDetailStore.booking.salon.name }}
                </span>
              </div>
            </div>
          
            <div class="text-left">
              <div class="flex items-center">
                <div
                  class="font-semibold mr-auto"
                  style="min-width: fit-content"
                >
                  Thợ được đặt :
                </div>
                <span class=" mr-3">
                  {{ BookingDetailStore.booking.staff.name }}
                </span>
              </div>
            </div>
            <div class="text-left">
              <div class="flex items-center">
                <div
                  class="font-semibold mr-auto"
                  style="min-width: fit-content"
                >
                  Thời gian đặt :
                </div>
                <span class=" mr-3">
                  {{ BookingDetailStore.booking.date_appointment_format }}
                </span>
              </div>
            </div>
          </div>

        </div>
        <!--    ////////////////////////  -->
        <div class="p-5 mt-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            Dịch Vụ Đã Đặt : &nbsp;
          </div>
          <div class="overflow-x-auto">
            <Table class="mt-5">
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th class="whitespace-nowrap"></Table.Th>
                  <Table.Th class="whitespace-nowrap"> Dịch Vụ</Table.Th>
                  <Table.Th class="whitespace-nowrap"> Giá</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr
                  v-for="(service,index) in BookingDetailStore.booking.services"
                  :key="service.id"
                >
                  <Table.Td>{{ index + 1 }}</Table.Td>
                  <Table.Td>{{ service.name }}</Table.Td>
                  <Table.Td>{{ service.price_format }} $</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td> <strong>GIÁ GỐC</strong> </Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td class="text-danger">{{ BookingDetailStore.booking.total_price_service_format }} $</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td> <strong>THÀNH TIỀN<Nav></Nav></strong> </Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td class="text-success">{{ BookingDetailStore.booking.price_format }} $</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
      <!-- END: Product Information -->
    </div>
    <!-- BEGIN: Profile Menu -->
    <div class="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block" v-if="BookingDetailStore.booking.voucher">
      <div class="p-5 rounded-md box">
        <div class="pb-4 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate text-center">Voucher</div>
        </div>
        <div class="flex items-center leading-8">
          <div class="mr-auto 700">
            <strong>Mã Voucher:</strong>
          </div>
          <div class="">
            {{  BookingDetailStore.booking.voucher.code }}
          </div>
        </div>
        <div class="flex items-center leading-8">
          <div class="mr-auto 700">
            <strong>Giá Trị:</strong>
          </div>
          <div class="text-success">
            -{{BookingDetailStore.booking.voucher.value}}{{BookingDetailStore.booking.voucher.type === 1 ? "%" : "$" }}
          </div>
        </div>
        <div class="flex items-center leading-8">
          <div class="mr-auto 700">
            <strong>Giảm:</strong>
          </div>
          <div class="text-success">
            {{ BookingDetailStore.booking.price_format - BookingDetailStore.booking.total_price_service_format}} $
          </div>
        </div>
        <div class="items-center leading-8">
          <div class=" w-full">
            <strong>Nội Dung:</strong>
          </div>
          <div class="w-full">
            {{BookingDetailStore.booking.voucher.description}}
          </div>
        </div>
      </div>
    </div>
    <!-- END: Profile Menu -->
  </div>
</template>
