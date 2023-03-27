import axios from "axios";
import { defineStore } from "pinia";

interface BannerListState {
  banners: any[],
  totalPage: number,
  recPerPage: number,
  page: number,
  type: string | number,
  selectedId: any,
  txtSearch: string,
  file_type: string,
  msg: string,
  loading: boolean
}

const access_token = localStorage.getItem("access_token");

export const useBannerListStore = defineStore("BannerList", {
  state: (): BannerListState => (
    {
      banners: [],
      totalPage: 10,
      recPerPage: 10,
      page: 1,
      type: 4,
      file_type: "",
      msg: "",
      selectedId: "",
      txtSearch: "",
      loading: false,
    }
  ),
  getters: {

  },
  actions: {
    async getBannerList(): Promise<void> {
      this.loading = true
      const res = await axios.get(`banner/list-banners`, {
        params: {
          page: this.page,
          type: this.type,
          txt_search: this.txtSearch,
          num_per_page: this.recPerPage,
        },
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      this.banners = res.data.data
      this.totalPage = res.data.total_page

      this.loading = false
      console.log(this.banners);

    },
  
    async deleteBanner(): Promise<void> {
      console.log(this.selectedId);
      
      return await axios
        .post(
          "banner/delete-banner",
          { id: this.selectedId },
        ).then((res) => {
          this.msg = res.data.message
          this.banners = this.banners.filter(item => {
            return item.id !== this.selectedId
          })
        }).catch((res) => {
          this.msg = res.data.message
        })
    },
  }
})