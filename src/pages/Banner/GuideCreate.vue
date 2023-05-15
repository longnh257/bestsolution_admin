<script setup lang="ts">
import { reactive, ref, provide } from "vue";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Notification from "../../base-components/Notification";
import { NotificationElement } from "../../base-components/Notification";
import Table from "../../base-components/Table";
import { normalizeInput } from "../../utils/helper";
import Tippy from "../../base-components/Tippy";
import ClassicEditor from "../../base-components/Ckeditor/ClassicEditor.vue";
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
import { useBannerCreateStore } from "../../stores/Banner/Banner-create";
import { useBannerListStore } from "../../stores/banner/banner-list";
import { BANNER_TYPE_GUIDE } from "../../constant";
import router from "../../router";

const BannerCreateStore = useBannerCreateStore();
let PreviewIMG: any = ref("");
let PreviewIMGVI: any = ref("");
let PreviewIMGThumb: any = ref("");

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

const submit = () => {
  BannerCreateStore.createGuide().then(function (response) {
    console.log(response.data);
    scc.value = response.data.message;
    successNotification.value?.showToast();
    router.push({
      name: 'Banner-list',
    });
  })
    .catch(function (error) {
      console.log(error.response);
      err.value = error.response.data.message;
      errorNotification.value?.showToast();
    });
};

const previewImages = (e: any) => {
  let file = e.target.files[0];
  BannerCreateStore.image = file;
  PreviewIMG.value = URL.createObjectURL(file);
};

const revokePreview = () => {
  URL.revokeObjectURL(PreviewIMG.value);
  PreviewIMG.value = ""
  BannerCreateStore.image = "";
};
const previewImagesVI = (e: any) => {
  let file = e.target.files[0];
  BannerCreateStore.image_vi = file;
  PreviewIMGVI.value = URL.createObjectURL(file);
};

const revokePreviewVI = () => {
  URL.revokeObjectURL(PreviewIMGVI.value);
  PreviewIMGVI.value = ""
  BannerCreateStore.image_vi = "";
};
const previewImagesThumb = (e: any) => {
  let file = e.target.files[0];
  BannerCreateStore.thumbnail = file;
  PreviewIMGThumb.value = URL.createObjectURL(file);
};

const revokePreviewThumb = () => {
  URL.revokeObjectURL(PreviewIMGThumb.value);
  PreviewIMGThumb.value = ""
  BannerCreateStore.thumbnail = "";
};
const saveBanner = () => {
  submit();
};

</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Thêm Mới Guide</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6">
    <div class="col-span-11 intro-y 2xl:col-span-9">
      <div class="p-5  intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="">

            <div class="mt-3">
              <FormLabel htmlFor="crud-form-2">Loại Guide</FormLabel>
              <FormSelect
                id="crud-form-2"
                type="text"
                v-model="BannerCreateStore.type"
                class="w-full"
              >
                <option value="image">Hình Ảnh</option>
                <option value="video">Video</option>
              </FormSelect>
            </div>

            <div v-if="BannerCreateStore.type==='image'">
              <div class="mt-3">
                <FormLabel htmlFor="crud-form-2">Hình ảnh Tiếng Anh</FormLabel>
                <FormInline class="flex-col items-start mt-1 xl:flex-row">
                  <div class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                    <div
                      class="grid grid-cols-10 gap-5 pl-4 pr-5"
                      v-if="PreviewIMG"
                    >
                      <div class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in">
                        <img
                          class="rounded-md"
                          alt=""
                          :src="PreviewIMG"
                        />
                        <Tippy
                          content="Remove this image?"
                          class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                          @click="revokePreview()"
                        >
                          <Lucide
                            icon="X"
                            class="w-4 h-4"
                          />
                        </Tippy>
                      </div>
                    </div>
                    <div class="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer">
                      <Lucide
                        icon="Image"
                        class="w-4 h-4 mr-2"
                      />
                      <span class="mr-1 text-primary"> Tải lên file</span>
                      <FormInput
                        id="horizontal-form-1"
                        type="file"
                        class="absolute top-0 left-0 w-full h-full opacity-0"
                        @change="previewImages"
                      />
                    </div>
                  </div>
                </FormInline>
              </div>
              <div class="mt-3">
                <FormLabel htmlFor="crud-form-2">Hình ảnh Tiếng Việt</FormLabel>
                <FormInline class="flex-col items-start mt-1 xl:flex-row">
                  <div class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                    <div
                      class="grid grid-cols-10 gap-5 pl-4 pr-5"
                      v-if="PreviewIMGVI"
                    >
                      <div class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in">
                        <img
                          class="rounded-md"
                          alt=""
                          :src="PreviewIMGVI"
                        />
                        <Tippy
                          content="Remove this image?"
                          class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                          @click="revokePreviewVI()"
                        >
                          <Lucide
                            icon="X"
                            class="w-4 h-4"
                          />
                        </Tippy>
                      </div>
                    </div>
                    <div class="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer">
                      <Lucide
                        icon="Image"
                        class="w-4 h-4 mr-2"
                      />
                      <span class="mr-1 text-primary"> Tải lên file</span>
                      <FormInput
                        id="horizontal-form-1"
                        type="file"
                        class="absolute top-0 left-0 w-full h-full opacity-0"
                        @change="previewImagesVI"
                      />
                    </div>
                  </div>
                </FormInline>
              </div>
            </div>

            <div v-if="BannerCreateStore.type==='video'">

              <div
                class="mt-3"
                v-if="BannerCreateStore.type==='video'"
              >
                <FormLabel
                  htmlFor="crud-form-1"
                  class="label-require"
                >Video</FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  class="w-full"
                  v-model="BannerCreateStore.video"
                />
              </div>
              <div class="mt-3">
                <FormLabel htmlFor="crud-form-2">Thumbnail</FormLabel>
                <FormInline class="flex-col items-start mt-1 xl:flex-row">
                  <div class="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                    <div
                      class="grid grid-cols-10 gap-5 pl-4 pr-5"
                      v-if="PreviewIMGThumb"
                    >
                      <div class="relative col-span-5 cursor-pointer md:col-span-2 h-28 image-fit zoom-in">
                        <img
                          class="rounded-md"
                          alt=""
                          :src="PreviewIMGThumb"
                        />
                        <Tippy
                          content="Remove this image?"
                          class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                          @click="revokePreviewThumb"
                        >
                          <Lucide
                            icon="X"
                            class="w-4 h-4"
                          />
                        </Tippy>
                      </div>
                    </div>
                    <div class="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer">
                      <Lucide
                        icon="Image"
                        class="w-4 h-4 mr-2"
                      />
                      <span class="mr-1 text-primary"> Tải lên file</span>
                      <FormInput
                        id="horizontal-form-1"
                        type="file"
                        class="absolute top-0 left-0 w-full h-full opacity-0"
                        @change="previewImagesThumb"
                      />
                    </div>
                  </div>
                </FormInline>
              </div>

            </div>

            <div class="mt-5">
              <FormLabel htmlFor="crud-form-2"> Nội dung</FormLabel>
              <ClassicEditor
                v-model="BannerCreateStore.content"
                class="mt-4"
                aria-placeholder="Thông Tin Giới Thiệu Về Salon"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- END: Banner Info -->

      <div class="flex flex-col justify-end gap-2 mt-5 md:flex-row">
        <!-- <Button
                  type="button"
                  class="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
                >
                  Cancel
                </Button> -->
        <!--   <Button
                  type="button"
                  class="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
                  @click="saveNew"
                >
                  Save & Add New Product
                </Button> -->
        <Button
          variant="primary"
          type="button"
          class="w-full py-3 md:w-52"
          @click="saveBanner"
        >
          Tạo Banner
        </Button>
      </div>
    </div>
  </div>
  <div class="p-5">
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
          {{ err }}
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
          {{ scc }}
        </div>
      </div>
    </Notification>
    <!-- END: Success Notification -->
  </div>
</template>
