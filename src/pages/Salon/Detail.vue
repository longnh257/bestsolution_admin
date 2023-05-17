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
import axios from "axios";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import router from "../../router";
import { useRoute } from "vue-router";
const route = useRoute();
var salon_id = route.params.salon_id;

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

const deleteConfirmationModal = ref(false);
const deleteButtonRef = ref(null);
const selectedSalonId = ref();
let err = ref([]);
let scc = ref([]);
const salonIndex: any = ref("");
const salonId: any = ref("");
const salon = ref();
let access_token = localStorage.getItem("access_token");
const errorNotification = ref<NotificationElement>();
const successNotification = ref<NotificationElement>();




provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el;
});
provide("bind[successNotification]", (el: NotificationElement) => {
  successNotification.value = el;
});

onMounted(() => {
  getSalon();
});

const getSalon = async () => {
  const response = await axios.get(`salon/${salon_id}`, {
    params: {
      page: 1,
    },
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  salon.value = response.data.data;
  console.log(salon.value);
};

const approveSalon = (id: any) => {
  salon.value.status = 1;
  salon.value.partner.is_approve = 1;
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
const setDeleteConfirmationModal = (
  value: boolean,
  salonId: any = null
) => {
  deleteConfirmationModal.value = value;
  selectedSalonId.value = salonId;
};
const deleteSalon = (salonId: any) => {
  deleteConfirmationModal.value = false;
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
      router.push("/salon/")
    })
    .catch(function (error) {
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
      console.log(error);
    });
};

const activeSalon = (id: any) => {
  salon.value.status = !salon.value.status;
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

</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Thông Tin Salon</h2>
  </div>
  <div
    class="grid grid-cols-12 gap-6 mt-5"
    v-if="salon"
  >
    <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
      <!-- BEGIN: Projects -->
      <div class="col-span-12 intro-y box 2xl:col-span-6">
        <div class="flex items-center px-5 py-3 border-b border-slate-200/60 dark:border-darkmode-400">
          <h2 class="mr-auto text-base font-medium">Hình Ảnh Salon</h2>
          <a
            href="#"
            variant="outline-secondary"
            class="p-2 slider-btn prev-btn"
            @click="prevNewProjects"
            style="
            position:absolute;
            z-index: 1000;
            top: 50%;
            "
          >
            <Lucide
              icon="ChevronLeft"
              class="w-4 h-4"
            />
          </a>
          <a
            href="##"
            variant="outline-secondary"
            class="p-2 slider-btn next-btn"
            @click="nextNewProjects"
            style="
            position:absolute;
            top: 50%;
            z-index: 1000;
            right: 20px;
            "
          >
            <Lucide
              icon="ChevronRight"
              class="w-4 h-4"
            />
          </a>
        </div>
        <TinySlider
          refKey="imgSliderRef"
          class="py-5"
        >
          <div
            class="px-5"
            v-for="item in salon.images"
            :key="item.id"
          >
            <img
              class="rounded-md mx-auto"
              :alt="item.created_at"
              :src="item.image"
              style="height: 300px;object-fit: contain;"
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
                  class="font-semibold mr-2"
                  style="min-width: fit-content"
                >
                  Tên Salon :
                </div>
                <span>
                  {{ salon.name }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="mt-2"
            style="font-size: 15px; line-height: 2rem"
          >
            <div class="text-left">
              <div class="flex">
                <div
                  class="font-semibold mr-2"
                  style="min-width: fit-content"
                >
                  Mô Tả :
                </div>
                <span>
                  {{ salon.description }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="mt-2"
            style="font-size: 15px; line-height: 2rem"
          >
            <div class="text-left">
              <div class="flex items-center">
                <div
                  class="font-semibold mr-2"
                  style="min-width: fit-content"
                >
                  Số Điện Thoại liên hệ :
                </div>
                <span>
                  {{ salon.phone }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--    ////////////////////////  -->
        <div class="p-5 mt-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            Giờ làm việc : &nbsp;
            <span class="italic text-success">(Múi Giờ : {{ salon.tz }})</span>
          </div>
          <div class="overflow-x-auto">
            <Table class="mt-5">
              <Table.Thead variant="light">
                <Table.Tr>
                  <Table.Th class="whitespace-nowrap"></Table.Th>
                  <Table.Th class="whitespace-nowrap"> Mở Cửa </Table.Th>
                  <Table.Th class="whitespace-nowrap"> Đóng Cửa</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr
                  v-for="schedule in salon.schedules"
                  :key="schedule.id"
                >
                  <Table.Td>{{
                    schedule.day == 0 ? "Chủ Nhật" : `Thứ ${schedule.day + 1}`
                  }}</Table.Td>
                  <Table.Td>{{ schedule.start_time }}</Table.Td>
                  <Table.Td>{{ schedule.end_time }}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
      <!-- END: Product Information -->
    </div>
    <!-- BEGIN: Profile Menu -->
    <div class="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
      <div class="mt-5 intro-y box lg:mt-0">
        <div class="relative flex items-center p-5">

          <div class="w-12 h-12 image-fit">
            <img
              v-if="salon.images[0]"
              :alt="salon.images[0].created_at"
              class="rounded-full"
              :src="salon.images[0].image"
            />
          </div>
          <div class="ml-4 mr-auto">
            <div class="text-base font-semibold">
              {{ salon.name }}
            </div>
            <div class="text-slate-500 flex">
              <Lucide
                icon="Phone"
                class="w-4 h-4 mr-2"
              />{{ salon.partner.phone }}
            </div>
          </div>
        </div>
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <router-link
            :to="{name:'salon-edit' , params:{salon_id:salon.id}}"
            class="flex"
          >
            <Lucide
              icon="Edit"
              class="w-4 h-4 mr-2"
            />
            Sửa thông tin salon
          </router-link>
        </div>
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <a
            class="flex items-center"
            href="#"
            v-if="salon.partner.is_approve == 0"
            @click="
                        (event:any) => {
                          event.preventDefault();
                          approveSalon(salon.partner.id);
                        }
                      "
          >
            <Lucide
              icon="Activity"
              class="w-4 h-4 mr-2"
            /> Phê duyệt
          </a>
          <a
            class="flex items-center text-success"
            href="#"
            v-if="salon.status == 0 && salon.partner.is_approve == 1"
            @click="
                        (event:any) => {
                          event.preventDefault();
                          activeSalon(salon.partner.id);
                        }
                      "
          >
            <Lucide
              icon="Unlock"
              class="w-4 h-4 mr-2"
            /> Mở Khóa
          </a>
          <a
            class="flex items-center text-danger"
            href="#"
            v-if="salon.status == 1 && salon.partner.is_approve == 1"
            @click="
                        (event:any) => {
                          event.preventDefault();
                          activeSalon(salon.partner.id);
                        }
                      "
          >
            <Lucide
              icon="Lock"
              class="w-4 h-4 mr-2"
            /> Khóa
          </a>
        </div>
        <div class="flex p-5 border-t border-slate-200/60 dark:border-darkmode-400 justify-center">
          <Button
            variant="danger"
            type="button"
            class="px-2 py-1"
            @click="
                        (event:any) => {
                          event.preventDefault();
                          setDeleteConfirmationModal(true, salon.id);
                        }
                      "
          >
            Xóa Salon
          </Button>
        </div>
      </div>
    </div>
    <!-- END: Profile Menu -->
  </div>
  <!-- END: Delete Confirmation Modal -->
  <div class="p-5">
    <!-- BEGIN: Success Notification -->
    <Notification
      refKey="errorNotification"
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
  </div>
  <!-- END: Success Notification -->
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
          variant="danger"
          type="button"
          class="w-24 mr-2"
          ref="deleteButtonRef"
          @click="($event) => deleteSalon(salonId.value)"
        >
          Xóa
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          @click="
            () => {
              setDeleteConfirmationModal(false);
            }
          "
          class="w-24 mr-1"
        >
          Hủy
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
</template>
