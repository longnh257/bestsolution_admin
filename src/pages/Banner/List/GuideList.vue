<script setup lang="ts">
import _ from "lodash";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import { FormInput, FormSelect } from "../../../base-components/Form";
import Table from "../../../base-components/Table";
import router from "../../../router";
import Paginate from "../../../../node_modules/vuejs-paginate-next/dist/vuejs-paginate-next.es";
import { useBannerListStore } from "../../../stores/banner/banner-list";
import ListDetail from "./ListDetail.vue";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { Menu } from "../../../base-components/Headless";
import Lucide from "../../../base-components/Lucide";

const BannerListStore = useBannerListStore()
BannerListStore.type = 3

BannerListStore.getBannerList()

const clickCallback = () => {
  BannerListStore.getBannerList()
  window.scrollTo(0, 0)
};
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Danh Sách Guide</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button
        variant="primary"
        class="mr-2 shadow-md"
        @click="router.push({ name: 'guide-create' })"
      >
        Thêm mới guide
      </Button>
      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div>
        <Menu>
          <Menu.Button
            :as="Button"
            class="px-2 !box"
            style="box-shadow: none !important"
          >
            <span class="flex items-center justify-center w-5 h-5">
              <Lucide
                icon="MoreVertical"
                class="block mx-auto"
              />
            </span>
          </Menu.Button>
          <Menu.Items class="w-40">
            <Menu.Item
              class="text-danger"
              style="cursor: pointer"
            >
              <router-link :to="{
              name: 'banner-list',
              query: { type: 3 },
            }">
                Guide
              </router-link>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

    </div>

    <!-- BEGIN: Data List -->
    <ListDetail
      :banners="BannerListStore.banners"
      v-if="!BannerListStore.loading"
    />
    <div
      v-else
      class="col-span-12"
    >
      <div class="w-8 mx-auto mt-5">
        <LoadingIcon icon="puff" />
      </div>
    </div>
    <!-- END: Data List -->
    <!-- BEGIN: Pagination -->
    <div
      class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap"
      style="margin-bottom: 50px"
      v-if="!BannerListStore.loading && BannerListStore.totalPage !== 1 && BannerListStore.banners.length>0 "
    >
      <paginate
        v-model="BannerListStore.page"
        :page-count="BannerListStore.totalPage"
        :page-range="5"
        :margin-pages="1"
        :click-handler="clickCallback"
        :prev-text="`<`"
        :next-text="'>'"
        :container-class="'pagination flex w-full mr-0 sm:w-auto sm:mr-auto'"
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
        v-model="BannerListStore.recPerPage"
        @change="BannerListStore.getBannerList"
      >
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </FormSelect>
    </div>
    <!-- END: Pagination -->
  </div>
</template>
