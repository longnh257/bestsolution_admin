 
<script setup lang="ts">
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { defineProps, PropType, ref, provide } from "vue";
import { Salon } from "../../../models/salon.models";
import router from "../../../router";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import Notification from "../../../base-components/Notification";
import { NotificationElement } from "../../../base-components/Notification";
import { useSalonListStore } from "../../../stores/salon-list";

const props = defineProps({
  salons: Object as PropType<Salon>,
});

const SalonListStore = useSalonListStore();
const selectedSalonId = ref(0);

const approveSalon = (id: number, index: number) => {
  SalonListStore.approveSalon(id, index)
    .then((res) => {
      successNotification.value?.showToast();
    })
    .catch((res) => {});
};

const activeSalon = (id: number, index: number) => {
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
    .catch(() => {});
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
          <Table.Th class="border-b-0 whitespace-nowrap"> H??nh ???nh </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Salon </Table.Th>

          <Table.Th class="text-center border-b-0 whitespace-nowrap">
            ?????a ch???
          </Table.Th>
          <Table.Th
            class="text-center border-b-0 whitespace-nowrap"
            style="width: 500px"
          >
            Tr???ng Th??i
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
            ??ang B??? Kh??a
          </Table.Td>
          <Table.Td
            class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            style="max-width: 500px"
            v-if="item.partner.is_approve == 0"
          >
            ??ang Ch??? Ph?? Duy???t
          </Table.Td>
          <Table.Td
            class="first:rounded-l-md last:rounded-r-md text-center text-success bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            style="max-width: 500px"
            v-if="item.status == 1 && item.partner.is_approve == 1"
          >
            ??ang Ho???t ?????ng
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
                    <Lucide icon="File" class="w-4 h-4 mr-2" /> Chi Ti???t
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
                    <Lucide icon="Edit" class="w-4 h-4 mr-2" /> Ch???nh S???a
                  </Menu.Item>
                  <Menu.Item
                    class="text-success"
                    style="cursor: pointer"
                    v-if="item.partner.is_approve == 0"
                    @click="approveSalon(item.partner.id, index)"
                  >
                    <Lucide icon="CheckCircle" class="w-4 h-4 mr-2" /> Ph?? Duy???t
                  </Menu.Item>
                  <Menu.Item
                    class="text-success"
                    style="cursor: pointer"
                    v-if="item.status == 0 && item.partner.is_approve == 1"
                    @click="activeSalon(item.partner.id, index)"
                  >
                    <Lucide icon="Unlock" class="w-4 h-4 mr-2" /> M??? Kh??a Salon
                  </Menu.Item>
                  <Menu.Item
                    class="text-danger"
                    style="cursor: pointer"
                    v-if="item.status == 1 && item.partner.is_approve == 1"
                    @click="activeSalon(item.partner.id, index)"
                  >
                    <Lucide icon="Lock" class="w-4 h-4 mr-2" />Kh??a Salon
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
                    <Lucide icon="XCircle" class="w-4 h-4 mr-2" /> X??a
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
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">X??a Salon?</div>
        <div class="mt-2 text-slate-500">
          B???n c?? th???t s??? mu???n x??a salon nay ?<br />
          T???t c??? d??? li???u v??? salon, nh??n vi??n ... s??? kh??ng th??? kh??i ph???c.
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
          H???y
        </Button>
        <Button
          variant="danger"
          type="button"
          class="w-24"
          ref="deleteButtonRef"
          @click="($event) => deleteSalon(selectedSalonId)"
        >
          X??a
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
    <Lucide icon="AlertTriangle" class="text-success" style="color: red" />
    <div class="ml-4 mr-4">
      <div class="font-medium">C?? l???i x???y ra!</div>
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
    <Lucide icon="CheckCircle" class="text-success" />
    <div class="ml-4 mr-4">
      <div class="font-medium">Th??nh C??ng</div>
      <div class="mt-1 text-slate-500">
        {{ SalonListStore.msg }}
      </div>
    </div>
  </Notification>
  <!-- END: Success Notification -->
</template>
