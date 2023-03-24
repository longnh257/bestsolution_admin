<script setup lang="ts">
import _ from "lodash";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import Preview from "../../base-components/Preview";
import axios from "axios";
import { onMounted, ref, provide } from "vue";
import router from "../../router";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Paginate from "../../../node_modules/vuejs-paginate-next/dist/vuejs-paginate-next.es";
import { log } from "console";
import { storeToRefs } from "pinia";
import { useSalonListStore } from "../../stores/salon/salon-list";

const SalonListStore = useSalonListStore()

SalonListStore.getSalonList()



const deleteConfirmationModal = ref(false);
const deleteButtonRef = ref(null);

const dataArr = ref<any[]>([]);
const selectedSalonIndex = ref();
const selectedSalonId = ref();


const salonIndex: any = ref("");
const salonId: any = ref("");

let err = ref([]);
let scc = ref([]);
const errorNotification = ref<NotificationElement>();
const successNotification = ref<NotificationElement>();
provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el;
});
provide("bind[successNotification]", (el: NotificationElement) => {
  successNotification.value = el;
});

const setDeleteConfirmationModal = (
  value: boolean,
  salonIndex: any = null,
  salonId: any = null
) => {
  deleteConfirmationModal.value = value;
  selectedSalonIndex.value = salonIndex;
  selectedSalonId.value = salonId;
};
const deleteSalon = (salonIndex: any, salonId: any) => {
  dataArr.value.splice(selectedSalonIndex.value, 1);
  deleteConfirmationModal.value = false;
  dataArr.value.splice(salonIndex, 1);
  axios
    .post(
      "admin/delete-salon",
      { id: selectedSalonId.value },
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    )
    .then(function (response) {
      scc.value = response.data.message;
      successNotification.value?.showToast();
    })
    .catch(function (error) {
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
    });
};
const searchSalon = () => {
  axios
    .get("salon/list-salon", {
      params: {
        page: page.value,
        txt_search: txt_search,
        num_per_page: recPerPage.value,
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then(function (response) {
      // handle success

      dataArr.value = response.data.data;
      pageCount.value = response.data.total_page;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

const activeSalon = (id: any, index: any) => {
  dataArr.value[index].status = !dataArr.value[index].status;

  axios
    .post(
      "salon/active",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    )
    .then(function (response) {
      scc.value = response.data.message;
      successNotification.value?.showToast();
    })
    .catch(function (error) {
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
      console.log(error);
    });
};
const approveSalon = (id: any, index: any) => {
  dataArr.value[index].status = 1;
  dataArr.value[index].partner.is_approve = 1;
  axios
    .post(
      "salon/approve",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    )
    .then(function (response) {
      scc.value = response.data.message;
      successNotification.value?.showToast();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};


const page = ref(1);
const pageCount = ref(10);
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
      <!-- <Menu>
        <Menu.Button :as="Button" class="px-2 !box">
          <span class="flex items-center justify-center w-5 h-5">
            <Lucide icon="Plus" class="w-4 h-4" />
          </span>
        </Menu.Button>
        <Menu.Items class="w-40">
          <Menu.Item>
            <Lucide icon="Printer" class="w-4 h-4 mr-2" /> Print
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to Excel
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to PDF
          </Menu.Item>
        </Menu.Items>
      </Menu> -->
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
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap"> Hình Ảnh </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Salon </Table.Th>

            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Địa chỉ
            </Table.Th>
            <Table.Th
              class="text-center border-b-0 whitespace-nowrap"
              style="width: 500px"
            >
              Trạng Thái
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr
            v-for="(item) in SalonListStore.salons"
            :key="item.id"
            class="intro-x"
          >
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div class="flex">
                <div class="w-10 h-10 image-fit zoom-in" v-if="item.images[0]">
                  <Tippy
                    as="img"
                    alt="Midone Tailwind HTML Admin Template"
                    class="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                    :src="item.images[0].image"
                    :content="`Uploaded at ${item.images[0].created_at}`"
                  />
                </div>
                <div
                  class="w-10 h-10 -ml-5 image-fit zoom-in"
                  v-if="item.images[1]"
                >
                  <Tippy
                    as="img"
                    alt="Midone Tailwind HTML Admin Template"
                    class="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                    :src="item.images[1].image"
                    :content="`Uploaded at ${item.images[1].created_at}`"
                  />
                </div>
                <div
                  class="w-10 h-10 -ml-5 image-fit zoom-in"
                  v-if="item.images[2]"
                >
                  <Tippy
                    as="img"
                    alt="Midone Tailwind HTML Admin Template"
                    class="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                    :src="item.images[2].image"
                    :content="`Uploaded at ${item.images[2].created_at}`"
                  />
                </div>
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <a
                href="#"
                class="font-medium whitespace-nowrap"
                @click="
                  () => {
                    router.push({
                      name: 'salon-detail',
                      params: { salon_id: item.id },
                    });
                  }
                "
              >
                {{ item.name }}
              </a>
              <div
                class="text-slate-500 text-xs whitespace-nowrap mt-0.5"
                style="display: flex; align-items: center"
              >
                <Lucide
                  icon="PhoneCall"
                  class="block mx-auto"
                  style="margin: 0 3px; width: 13px"
                />
                {{ item.phone }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ item.address }}
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md text-center text-danger bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
              style="max-width: 500px"
              v-if="item.status == 0 && item.partner.is_approve == 1"
            >
              Đang Bị Khóa
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
              style="max-width: 500px"
              v-if="item.partner.is_approve == 0"
            >
              Đang Chờ Phê Duyệt
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md text-center text-success bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
              style="max-width: 500px"
              v-if="item.status == 1 && item.partner.is_approve == 1"
            >
              Đang Hoạt Động
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400"
            >
              <div class="flex items-center justify-center">
                <Menu>
                  <Menu.Button
                    :as="Button"
                    class="px-2 !box"
                    style="box-shadow: none !important"
                  >
                    <span class="flex items-center justify-center w-5 h-5">
                      <Lucide icon="MoreVertical" class="block mx-auto" />
                    </span>
                  </Menu.Button>
                  <Menu.Items class="w-40">
                    <Menu.Item
                      @click="
                        () => {
                          router.push({
                            name: 'salon-detail',
                            params: { salon_id: item.id },
                          });
                        }
                      "
                    >
                      <Lucide icon="File" class="w-4 h-4 mr-2" /> Chi Tiết
                    </Menu.Item>
                    <Menu.Item
                      href="#"
                      @click="
                        () => {
                          router.push({
                            name: 'salon-edit',
                            params: { salon_id: item.id },
                          });
                        }
                      "
                    >
                      <Lucide icon="Edit" class="w-4 h-4 mr-2" /> Chỉnh Sửa
                    </Menu.Item>
                    <Menu.Item
                      class="text-success"
                      href="#"
                      v-if="item.partner.is_approve == 0"
                      @click="
                        (event:any) => {
                          event.preventDefault();
                          approveSalon(item.partner.id, index);
                        }
                      "
                    >
                      <Lucide icon="CheckCircle" class="w-4 h-4 mr-2" /> Phê
                      Duyệt
                    </Menu.Item>
                    <Menu.Item
                      class="text-success"
                      href="#"
                      v-if="item.status == 0 && item.partner.is_approve == 1"
                      @click="
                        (event:any) => {
                          event.preventDefault();
                          activeSalon(item.partner.id, index);
                        }
                      "
                    >
                      <Lucide icon="Unlock" class="w-4 h-4 mr-2" /> Mở Khóa
                      Salon
                    </Menu.Item>
                    <Menu.Item
                      class="text-danger"
                      href="#"
                      v-if="item.status == 1 && item.partner.is_approve == 1"
                      @click="
                        (event:any) => {
                          event.preventDefault();
                          activeSalon(item.partner.id, index);
                        }
                      "
                    >
                      <Lucide icon="Lock" class="w-4 h-4 mr-2" />Khóa Salon
                    </Menu.Item>
                    <Menu.Item
                      class="text-danger"
                      href="#"
                      @click="
                        (event:any) => {
                          event.preventDefault();
                          setDeleteConfirmationModal(true, index, item.id);
                        }
                      "
                    >
                      <Lucide icon="XCircle" class="w-4 h-4 mr-2" /> Xóa
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->
    <!-- BEGIN: Pagination -->
    <div
      class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap"
      style="margin-bottom: 50px"
    >
      <paginate
        v-model="page"
        :page-count="pageCount"
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
  <!-- BEGIN: Delete Confirmation Modal -->
  <Dialog
    :open="deleteConfirmationModal"
    @close="
      () => {
        setDeleteConfirmationModal(false);
      }
    "
    :initialFocus="deleteButtonRef"
  >
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Xóa Salon?</div>
        <div class="mt-2 text-slate-500">
          Bạn có thật sự muốn xóa salon nay ?<br />
          Tất cả dự liệu về salon, nhân viên ... sẽ không thể khôi phục.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
          variant="outline-secondary"
          type="button"
          @click="
            () => {
              setDeleteConfirmationModal(false);
            }
          "
          class="w-24 mr-3"
        >
          Hủy
        </Button>
        <Button
          variant="danger"
          type="button"
          class="w-24"
          ref="deleteButtonRef"
          @click="($event) => deleteSalon(salonIndex.value, salonId.value)"
        >
          Xóa
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
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
    <Notification refKey="successNotification" class="flex">
      <Lucide icon="CheckCircle" class="text-success" />
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
