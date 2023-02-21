

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Salon</h2>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    
    <div class="col-span-12 intro-y">
      <!-- BEGIN: Table Head Options -->
      <Preview class="intro-y box" v-slot="{ toggle }">
        <div class="p-5">
          <Preview.Panel>
            <div class="overflow-x-auto">
              
              <Table class="mt-5">
                <Table.Thead variant="light">
                  <Table.Tr>
                    <Table.Th class="whitespace-nowrap">#</Table.Th>
                    <Table.Th class="whitespace-nowrap"> First Name </Table.Th>
                    <Table.Th class="whitespace-nowrap"> Last Name </Table.Th>
                    <Table.Th class="whitespace-nowrap"> Username </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr v-for="item in dataArr" :key="item.id">
                    <Table.Td v-text="item.name"></Table.Td>
                    <Table.Td v-text="item.name"></Table.Td>
                    <Table.Td v-text="item.name"></Table.Td>
                    <Table.Td v-text="item.name"></Table.Td>
                  </Table.Tr>
                </Table.Tbody>
                  
              </Table>
              <span>
                {{ stringArray }}
              </span>
            </div>
          </Preview.Panel>
          <Preview.Panel type="source">
            <Preview.Highlight>
              {{`
              <div class="overflow-x-auto">
                <Table>
                  <Table.Thead variant="dark">
                    <Table.Tr>
                      <Table.Th class="whitespace-nowrap">#</Table.Th>
                      <Table.Th class="whitespace-nowrap">
                        First Name
                      </Table.Th>
                      <Table.Th class="whitespace-nowrap"> Last Name </Table.Th>
                      <Table.Th class="whitespace-nowrap"> Username </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>1</Table.Td>
                      <Table.Td>Angelina</Table.Td>
                      <Table.Td>Jolie</Table.Td>
                      <Table.Td>@angelinajolie</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>2</Table.Td>
                      <Table.Td>Brad</Table.Td>
                      <Table.Td>Pitt</Table.Td>
                      <Table.Td>@bradpitt</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>3</Table.Td>
                      <Table.Td>Charlie</Table.Td>
                      <Table.Td>Hunnam</Table.Td>
                      <Table.Td>@charliehunnam</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
                <Table class="mt-5">
                  <Table.Thead variant="light">
                    <Table.Tr>
                      <Table.Th class="whitespace-nowrap">#</Table.Th>
                      <Table.Th class="whitespace-nowrap">
                        First Name
                      </Table.Th>
                      <Table.Th class="whitespace-nowrap"> Last Name </Table.Th>
                      <Table.Th class="whitespace-nowrap"> Username </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>1</Table.Td>
                      <Table.Td>Angelina</Table.Td>
                      <Table.Td>Jolie</Table.Td>
                      <Table.Td>@angelinajolie</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>2</Table.Td>
                      <Table.Td>Brad</Table.Td>
                      <Table.Td>Pitt</Table.Td>
                      <Table.Td>@bradpitt</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>3</Table.Td>
                      <Table.Td>Charlie</Table.Td>
                      <Table.Td>Hunnam</Table.Td>
                      <Table.Td>@charliehunnam</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
              `}}
            </Preview.Highlight>
          </Preview.Panel>
        </div>
      </Preview>
      <!-- END: Table Head Options -->
     
    </div>
  </div>
</template>

<script setup lang='ts'>
import _ from "lodash";
import Table from "../base-components/Table";
import Preview from "../base-components/Preview";
import { FormSwitch } from "../base-components/Form";
import axios from 'axios';
import { onMounted, onBeforeMount, ref, reactive,defineComponent} from "vue";


const dataArr = ref([])

onMounted(() => {
  //const axios = require('axios'); // legacy way

  // Make a request for a user with a given ID
    axios.get('http://dev.api.booking.kendemo.com:3008/api/v1/salon/list-salon',{
      params: {
        num_per_page  :10 , 
        page : 1,
        txt_search : '',
      }
    })
    .then(function (response) {
      // handle success
      dataArr.value = response.data.data
      console.log(dataArr);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    ;
  })

</script>