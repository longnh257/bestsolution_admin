import axios from "axios";
import { defineStore } from "pinia";

interface VoucherListState {
  vouchers: any,
  totalPage: number,
  recPerPage: number,
  page: number,
  txtSearch: string,
  msg: string,
  loading: boolean
}

const access_token = localStorage.getItem("access_token");

export const useVoucherListStore = defineStore("VoucherList", {
  state: (): VoucherListState => (
    {
      vouchers: [],
      totalPage: 10,
      recPerPage: 10,
      page: 1,
      msg: "",
      txtSearch: "",
      loading: false,
    }
  ),
  getters: {

  },
  actions: {
    async getVoucherList(): Promise<void> {
      this.loading = true

      const res = await axios.get("voucher/list-vouchers", {
        params: {
          page: this.page,
          txt_search: this.txtSearch,
          num_per_page: this.recPerPage,
        },
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      this.vouchers = res.data.data
      this.totalPage = res.data.total_page

      this.loading = false
      console.log(this.vouchers);

    },
  }
})