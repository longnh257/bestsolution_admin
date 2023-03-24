 
<script setup lang="ts">
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { PropType, ref, provide } from "vue";
import router from "../../../router";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import Notification from "../../../base-components/Notification";
import constant from "../../../constant/index";


const props = defineProps({
  vouchers: Object as PropType<any>,
});



</script>

<template>
  <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
    <Table class="border-spacing-y-[10px] border-separate -mt-2">
      <Table.Thead>
        <Table.Tr>
          <Table.Th class="border-b-0 whitespace-nowrap"> ID </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Salon </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Mã Voucher </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Giá Trị </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Ngày Áp Dụng </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Ngày Kết Thúc</Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Loại Khách Hàng</Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Ngày Tạo </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Trạng Thái </Table.Th>
          <Table.Th class="text-center border-b-0 whitespace-nowrap"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr
          v-for="item in props.vouchers"
          :key="item.id"
          class="intro-x"
        >

          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">

            <router-link
              :to="{
              name: 'voucher-detail',
              params: { voucher_id: item.id },
            }"
              target='_blank'
            >
              {{ item.id }}
            </router-link>
          </Table.Td>
        
          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            <router-link
              :to="{
                    name: 'salon-detail',
                    params: { salon_id: item.salon_id },
                  }"
              target='_blank'
            >
              {{ item.salon ? item.salon.name : `#${item.salon_id}` }}
            </router-link>
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            {{ item.code }}
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            {{ item.value  }}{{ item.type == 1 ? '%' : ' $'  }}
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">

            {{  item.start_date  }}
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">

            {{ item.expiration_date  }}
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            {{ constant.VOUCHER_CUSTOMER_TYPE[item.type_customer] }}
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            {{ item.created_at }}
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
            {{ item.status_name }}
          </Table.Td>
          <Table.Td class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
            <div class="flex items-center justify-center">
            <router-link
              :to="{
              name: 'voucher-detail',
              params: { voucher_id: item.id },
            }"
              target='_blank'
            >
            <Lucide
              icon="Eye"
              class="w-4 h-4 mr-2 text-warning"
            />
            </router-link>
          </div>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </div>

</template>
