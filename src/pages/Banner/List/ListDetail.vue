 
<script setup lang="ts">
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { PropType, ref, provide } from "vue";
import router from "../../../router";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import Notification from "../../../base-components/Notification";
import { NotificationElement } from "../../../base-components/Notification";
import { useBannerListStore } from "../../../stores/banner/banner-list";
import { BANNER_TYPE_BANNER } from "../../../constant";

const props = defineProps({
  banners: Object as PropType<any>,
});

const BannerListStore = useBannerListStore();
const selectedBannerId = ref(0);

const deleteBanner = () => {
  deleteConfirmationModal.value = false;
  BannerListStore.deleteBanner()
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
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div
        v-for="item in props.banners"
        :key="item.id"
        class="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
      >
        <div class="box">
          <div class="p-2">
            <div class="h-40 overflow-hidden  2xl:h-56 image-fit ">
              <div v-if="item.type === 3">
                <a
                  :href="item.file"
                  target="_blank"
                  v-if="item.file_type && item.file_type=='video'"
                >
                  <img
                    alt="Banner"
                    class="rounded-md"
                    :src="item.thumbnail"
                  />
                </a>
                <img
                  alt="Banner"
                  class="rounded-md"
                  :src="item.file"
                  v-else
                />
              </div>
              <img
                v-if="item.type === 4"
                alt="Banner"
                class="rounded-md"
                :src="item.image"
              />

            </div>
            <div class="mt-5 text-slate-600 dark:text-slate-500">
              <div
                class="flex items-center line-clamp-3"
                v-html=" item.content"
              >
              </div>

            </div>
          </div>
          <div class="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
            <a
              class="flex items-center mr-auto text-primary"
              href="#"
            >
              <Lucide
                icon="Eye"
                class="w-4 h-4 mr-1"
              /> Preview
            </a>
            <a
              class="flex items-center mr-3"
              href="#"
            >
              <Lucide
                icon="CheckSquare"
                class="w-4 h-4 mr-1"
              /> Edit
            </a>
            <a
              class="flex items-center text-danger"
              href="#"
              @click.prevent=" 
              () => {
                BannerListStore.selectedId = item.id
                setDeleteConfirmationModal(true)
              }"
            >
              <Lucide
                icon="Trash2"
                class="w-4 h-4 mr-1"
              /> Delete
            </a>
          </div>
        </div>
      </div>
    </div>
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
        <div class="mt-5 text-3xl">Xóa Banner?</div>
        <div class="mt-2 text-slate-500">
          Bạn có thật sự muốn xóa banner nay ?<br />
          Tất cả dự liệu về banner, nhân viên ... sẽ không thể khôi phục.
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
          @click="($event) => deleteBanner()"
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
        {{ BannerListStore.msg }}
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
        {{ BannerListStore.msg }}
      </div>
    </div>
  </Notification>
  <!-- END: Success Notification -->
</template>
