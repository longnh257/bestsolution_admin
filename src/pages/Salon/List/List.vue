<script setup lang="ts">
import _ from "lodash";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import { FormInput, FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import Preview from "../../../base-components/Preview";
import axios from "axios";
import { onMounted, ref, provide } from "vue";
import router from "../../../router";
import Notification from "../../../base-components/Notification";
import { NotificationElement } from "../../../base-components/Notification";
import Paginate from "../../../../node_modules/vuejs-paginate-next/dist/vuejs-paginate-next.es";
import { log } from "console";
import { useSalonListStore } from "../../../stores/salon-list";
import { storeToRefs } from "pinia";
import ListDetail from "./ListDetail.vue";
import { setTimeout } from "timers";

const SalonListStore = useSalonListStore();

SalonListStore.getSalonList();


let txt_search = "";

const searchSalon = () => {
 
};

const refreshSearch = () => {
  if (txt_search == "") {
    searchSalon();
  }
};

const page = ref(1);
const recPerPage = ref(10);
const clickCallback = () => {
  searchSalon();
  window.scrollTo(0, 0);
};

const changeRecPerPage = () => {
  searchSalon();
};

</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Danh Sách Salon</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap"
    >
      <Button
        variant="primary"
        class="mr-2 shadow-md"
        @click="router.push({ name: 'salon-create' })"
      >
        Thêm mới salon
      </Button>
      <div class="hidden mx-auto md:block text-slate-500">
        Showing 1 to 10 of 150 entries
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <form @submit.prevent="searchSalon">
            <FormInput
              type="text"
              class="w-56 pr-10 !box"
              placeholder="Tên, SĐT Salon"
              v-model="txt_search"
              @blur="refreshSearch"
            />
            <Lucide
              icon="Search"
              class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
            />
          </form>
        </div>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <ListDetail :salons="SalonListStore.salons" />
    <!-- END: Data List -->
    <!-- BEGIN: Pagination -->
    <div
      class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap"
      style="margin-bottom: 50px"
    >
      <paginate
        v-model="page"
        :page-count="SalonListStore.totalPage"
        :page-range="5"
        :margin-pages="1"
        :click-handler="clickCallback"
        :prev-text="`<`"
        :next-text="'>'"
        :container-class="'flex w-full mr-0 sm:w-auto sm:mr-auto'"
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
        class="w-30 mt-3 !box sm:mt-0"
        v-model="recPerPage"
        @change="changeRecPerPage"
      >
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </FormSelect>
    </div>
    <!-- END: Pagination -->
  </div>
 
</template>
