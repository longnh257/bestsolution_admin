<script setup lang="ts">
import _ from "lodash";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import { FormInput, FormSelect } from "../../../base-components/Form";
import router from "../../../router";
import Paginate from "../../../../node_modules/vuejs-paginate-next/dist/vuejs-paginate-next.es";
import { useBookingListStore } from "../../../stores/booking/booking-list";
import ListDetail from "./ListDetail.vue";
import LoadingIcon from "../../../base-components/LoadingIcon";

const BookingListStore = useBookingListStore();

BookingListStore.getBookingList();

console.log(BookingListStore.bookings);

const clickCallback = () => {
  BookingListStore.getBookingList();
  window.scrollTo(0, 0);
};
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Danh Sách Booking</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="hidden mx-auto md:block text-slate-500">
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <form @submit.prevent="">
            <FormInput
              type="text"
              class="w-56 pr-10 !box"
              placeholder="Tên Salon, SĐT Khách, Mã Voucher"
              v-model="BookingListStore.txtSearch"
              @change="BookingListStore.getBookingList()"
            />
            <Lucide
              icon="Search"
              style="cursor: pointer"
              class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
            />
          </form>
        </div>
      </div>
    </div>
 <!-- BEGIN: Pagination -->
 <div class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
      <paginate
        v-if="!BookingListStore.loading && BookingListStore.totalPage && BookingListStore.totalPage != 1"
        v-model="BookingListStore.page"
        :page-count="BookingListStore.totalPage"
        :page-range="5"
        :margin-pages="1"
        :click-handler="clickCallback"
        :prev-text="`<`"
        :next-text="'>'"
        :container-class="'pagination flex w-full mr-0 sm:w-auto'"
        :page-class="'flex-1 sm:flex-initial'"
        :page-link-class="'transition duration-200 border py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800  dark:text-slate-300 px-1 sm:px-3'"
        :prev-class="'flex-1 sm:flex-initial'"
        :prev-link-class="'transition duration-200 border py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800  dark:text-slate-300 px-1 sm:px-3'"
        :next-class="'flex-1 sm:flex-initial'"
        :next-link-class="'transition duration-200 border py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800  dark:text-slate-300 px-1 sm:px-3'"
        :active-class="'!box font-medium dark:bg-darkmode-400 !mr-0'"
      >
      </paginate>
      <FormSelect
        class="w-30 mt-3 !box sm:mt-0 ml-auto"
        v-if="!BookingListStore.loading && (BookingListStore.bookings.length >10 || BookingListStore.totalPage > 1)"
        v-model="BookingListStore.recPerPage"
        @change="()=> {
          BookingListStore.page = 1
          BookingListStore.getBookingList()
          }"
      >
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </FormSelect>
    </div>
    <!-- END: Pagination -->
    <!-- BEGIN: Data List -->
    <div
      v-if="BookingListStore.loading"
      class="col-span-12"
    >
      <div class="w-8 mx-auto mt-5">
        <LoadingIcon icon="puff" />
      </div>
    </div>
    <div v-else class="col-span-12">
      <ListDetail
        :bookings="BookingListStore.bookings"
        v-if=" BookingListStore.bookings.length != 0"
      />
      <div
        v-else
        class="col-span-12"
      >
        <div class="w-100 mx-auto mt-10 text-center">
          <h1 style="font-weight:700;font-size:18px">Chưa có booking nào.</h1>
        </div>
      </div>
    </div>

    <!-- END: Data List -->
    
    <!-- BEGIN: Pagination -->
    <div class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
      <paginate
        v-if="!BookingListStore.loading && BookingListStore.totalPage && BookingListStore.totalPage != 1"
        v-model="BookingListStore.page"
        :page-count="BookingListStore.totalPage"
        :page-range="5"
        :margin-pages="1"
        :click-handler="clickCallback"
        :prev-text="`<`"
        :next-text="'>'"
        :container-class="'pagination flex w-full mr-0 sm:w-auto'"
        :page-class="'flex-1 sm:flex-initial'"
        :page-link-class="'transition duration-200 border py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800  dark:text-slate-300 px-1 sm:px-3'"
        :prev-class="'flex-1 sm:flex-initial'"
        :prev-link-class="'transition duration-200 border py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800  dark:text-slate-300 px-1 sm:px-3'"
        :next-class="'flex-1 sm:flex-initial'"
        :next-link-class="'transition duration-200 border py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800  dark:text-slate-300 px-1 sm:px-3'"
        :active-class="'!box font-medium dark:bg-darkmode-400 !mr-0'"
      >
      </paginate>
      <FormSelect
        class="w-30 mt-3 !box sm:mt-0 ml-auto"
        v-if="!BookingListStore.loading && (BookingListStore.bookings.length >10 || BookingListStore.totalPage > 1)"
        v-model="BookingListStore.recPerPage"
        @change="()=> {
          BookingListStore.page = 1
          BookingListStore.getBookingList()
          }"
      >
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </FormSelect>
    </div>
    <!-- END: Pagination -->
  </div>
</template>
