<script setup lang="ts">
import _ from "lodash";
import { ref } from "vue";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormInline,
  FormSelect,
  FormLabel,
  FormHelp,
  FormCheck,
  InputGroup,
  FormSwitch,
} from "../../base-components/Form";
import TomSelect from "../../base-components/TomSelect";
import { ClassicEditor } from "../../base-components/Ckeditor";
import Alert from "../../base-components/Alert";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Table from "../../base-components/Table";

const subcategory = ref(["0"]);
const editorData = ref("<p>Content of the editor.</p>");
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Thêm Mới Salon</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6">
    <div class="col-span-11 intro-y 2xl:col-span-9 ">
    
      <!-- BEGIN: Product Information -->
      <div class="p-5 mt-5 intro-y box">
        <div
          class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400"
        >
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="User" class="w-4 h-4 mr-2" /> 
            Thông Tin Tài Khoản
          </div>
          <div class="mt-5">
            <FormInline
              class="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0"
            >
              <FormLabel class="xl:w-64 xl:!mr-10">
                <div class="text-left">
                  <div class="flex items-center">
                    <div class="font-medium">Tên chủ salon</div>
                    <div
                      class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md"
                    >
                      Required
                    </div>
                  </div>
                </div>
              </FormLabel>
              <div class="flex-1 w-full mt-3 xl:mt-0">
                <FormInput
                  id="product-name"
                  type="text"
                  placeholder="Product name"
                />
              </div>
            </FormInline>
            <FormInline
              class="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0"
            >
              <FormLabel class="xl:w-64 xl:!mr-10">
                <div class="text-left">
                  <div class="flex items-center">
                    <div class="font-medium">Số Điện Thoại</div>
                    <div
                      class="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md"
                    >
                      Required
                    </div>
                  </div>
                </div>
              </FormLabel>
              <div class="flex-1 w-full mt-3 xl:mt-0">
                <FormSelect id="category">
                  <option
                    v-for="(faker, fakerKey) in _.take(fakerData, 9)"
                    :key="fakerKey"
                    :value="faker.categories[0].name"
                  >
                    {{ faker.categories[0].name }}
                  </option>
                </FormSelect>
              </div>
            </FormInline>
            <FormInline
              class="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0"
            >
              <FormLabel class="xl:w-64 xl:!mr-10">
                <div class="text-left">
                  <div class="flex items-center">
                    <div class="font-medium">Subcategory</div>
                  </div>
                  <div class="mt-3 text-xs leading-relaxed text-slate-500">
                    You can add a new subcategory or choose from the existing
                    subcategory list.
                  </div>
                </div>
              </FormLabel>
              <div class="flex-1 w-full mt-3 xl:mt-0">
                <TomSelect
                  v-model="subcategory"
                  :options="{
                    placeholder: 'Etalase',
                  }"
                  class="w-full"
                  multiple
                >
                  <option
                    v-for="(faker, fakerKey) in _.take(fakerData, 2)"
                    :key="fakerKey"
                    :value="fakerKey"
                  >
                    {{ faker.categories[0].name }}
                  </option>
                </TomSelect>
              </div>
            </FormInline>
          </div>
        </div>
      </div>
      <!-- END: Product Information -->
    
      <div class="flex flex-col justify-end gap-2 mt-5 md:flex-row">
        <Button
          type="button"
          class="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
        >
          Cancel
        </Button>
        <Button
          type="button"
          class="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
        >
          Save & Add New Product
        </Button>
        <Button variant="primary" type="button" class="w-full py-3 md:w-52">
          Save
        </Button>
      </div>
    </div>
   
  </div>
</template>
