 
<script setup lang="ts">
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { PropType, ref, provide } from "vue";
import { Salon } from "../../../models/salon.models";
import router from "../../../router";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import Notification from "../../../base-components/Notification";
import { NotificationElement } from "../../../base-components/Notification";
import { useSalonListStore } from "../../../stores/salon/salon-list";

const props = defineProps({
  salons: Object as PropType<Salon>,
});

const SalonListStore = useSalonListStore();
const selectedSalonId = ref(0);

const approveSalon = (id: number, index: any) => {
  SalonListStore.approveSalon(id, index)
    .then((res) => {
      successNotification.value?.showToast();
    })
    .catch((res) => { });
};

const activeSalon = (id: number, index: any) => {
  SalonListStore.activeSalon(id, index)
    .then(() => {
      successNotification.value?.showToast();
    })
    .catch(() => {
      errorNotification.value?.showToast();
    });
};

const deleteSalon = (id: number) => {
  deleteConfirmationModal.value = false;
  SalonListStore.deleteSalon(id)
    .then(() => {
      successNotification.value?.showToast();
    })
    .catch(() => { });
};


const setDeleteConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const deleteConfirmationModal = ref(false);
const deleteButtonRef = ref(null);
const errorNotification = ref<NotificationElement>();
const successNotification = ref<NotificationElement>();
provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el;
});
provide("bind[successNotification]", (el: NotificationElement) => {
  successNotification.value = el;
});

</script>

<template>
  <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
    <Table class="border-spacing-y-[10px] border-separate -mt-2">
      <Table.Thead>
        <Table.Tr>
          <Table.Th class="border-b-0 whitespace-nowrap"> Hình Ảnh </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Salon </Table.Th>

          <Table.Th class="text-center border-b-0 whitespace-nowrap">
            Địa chỉ
          </Table.Th>
          <Table.Th class="text-center border-b-0 whitespace-nowrap">
            Booking
          </Table.Th>
          <Table.Th class="text-center border-b-0 whitespace-nowrap">
            Dịch Vụ
          </Table.Th>
          <Table.Th class="text-center border-b-0 whitespace-nowrap">
            Thợ
          </Table.Th>
          <Table.Th class="text-center border-b-0 whitespace-nowrap">
            Rating
          </Table.Th>
          <Table.Th class="text-center border-b-0 whitespace-nowrap">
            Trạng thái
          </Table.Th>
          <Table.Th class="text-center border-b-0 whitespace-nowrap">
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr
          v-for="(item, index) in props.salons"
          :key="item.id"
          class="intro-x"
        >
          <Table.Td class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            <div class="flex">
              <div
                class="w-10 h-10 image-fit zoom-in"
                v-if="item.images[0]"
              >
                <Tippy
                  as="img"
                  alt="img"
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
          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            <router-link
              :to="{
                          name: 'salon-detail',
                          params: { salon_id: item.id },
                        }"
              style="display:flex !important"
            >
              {{ item.name }}
            </router-link>
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
          <Table.Td class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            {{ item.address }}
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            <router-link
              :to="{
              name: 'booking-list',
              query: { salon_id: item.id },
            }"
              class="text-info"
              target='_blank'
            >
              {{ item.total_booking }}
            </router-link>
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            <router-link
              :to="{
                          name: 'salon-detail',
                          params: { salon_id: item.id },
                        }"
              class="text-info"
            >
              {{ item.total_service }}
            </router-link>
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            <router-link
              :to="{
                          name: 'salon-detail',
                          params: { salon_id: item.id },
                        }"
              class="text-info"
            >
              {{ item.total_staff }}
            </router-link>
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            {{ item.rating }} Sao
            <br>
            ({{ item.total_feedback }} Feedback)
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

          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
            <div class="flex items-center justify-center">
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
                <Menu.Items class="w-48">
                  <Menu.Item>
                    <router-link
                      :to="{
                          name: 'salon-detail',
                          params: { salon_id: item.id },
                        }"
                      style="display:flex !important"
                    >
                      <Lucide
                        icon="File"
                        class="w-4 h-4 mr-2"
                      />
                      Chi Tiết
                    </router-link>
                  </Menu.Item>
                  <Menu.Item>
                    <router-link
                      :to="{
                          name: 'salon-edit',
                          params: { salon_id: item.id },
                        }"
                      style="display:flex !important"
                    >
                      <Lucide
                        icon="Edit"
                        class="w-4 h-4 mr-2"
                      /> Chỉnh Sửa
                    </router-link>
                  </Menu.Item>
                  <Menu.Item>
                    <router-link
                      :to="{
                          name: 'job-create',
                          params: { salon_id: item.id },
                        }"
                      style="display:flex !important"
                    >
                      <Lucide
                        icon="Send"
                        class="w-4 h-4 mr-2"
                      />
                      Đăng Tin Tuyển Dụng
                    </router-link>
                  </Menu.Item>
                 <!--  <Menu.Item>
                    <router-link
                      :to="{
                          name: 'job-list',
                          params: { salon_id: item.id },
                        }"
                      style="display:flex !important"
                    >
                      <Lucide
                        icon="List"
                        class="w-4 h-4 mr-2"
                      />
                      DS Tin Tuyển Dụng
                    </router-link>
                  </Menu.Item> -->
                  <Menu.Item
                    class="text-success"
                    style="cursor: pointer"
                    v-if="item.partner.is_approve == 0"
                    @click="approveSalon(item.partner.id,index)"
                  >
                    <Lucide
                      icon="CheckCircle"
                      class="w-4 h-4 mr-2"
                    /> Phê Duyệt
                  </Menu.Item>
                  <Menu.Item
                    class="text-success"
                    style="cursor: pointer"
                    v-if="item.status == 0 && item.partner.is_approve == 1"
                    @click="activeSalon(item.partner.id, index)"
                  >
                    <Lucide
                      icon="Unlock"
                      class="w-4 h-4 mr-2"
                    /> Mở Khóa Salon
                  </Menu.Item>
                  <Menu.Item
                    class="text-danger"
                    style="cursor: pointer"
                    v-if="item.status == 1 && item.partner.is_approve == 1"
                    @click="activeSalon(item.partner.id, index)"
                  >
                    <Lucide
                      icon="Lock"
                      class="w-4 h-4 mr-2"
                    />Khóa Salon
                  </Menu.Item>
                  <Menu.Item
                    class="text-danger"
                    style="cursor: pointer"
                    @click="
                      () => {
                        setDeleteConfirmationModal(true);
                        selectedSalonId = item.id;
                      }
                    "
                  >
                    <Lucide
                      icon="XCircle"
                      class="w-4 h-4 mr-2"
                    /> Xóa
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
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
        <Lucide
          icon="XCircle"
          class="w-16 h-16 mx-auto mt-3 text-danger"
        />
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
          @click="($event) => deleteSalon(selectedSalonId)"
        >
          Xóa
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
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
        {{ SalonListStore.msg }}
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
        {{ SalonListStore.msg }}
      </div>
    </div>
  </Notification>
  <!-- END: Success Notification -->
</template>
