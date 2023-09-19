import axios from "axios";
import { defineStore } from "pinia";
import { Salon } from "../../models/salon.models";

interface SalonListState {
  salons: Salon[],
  totalPage: number,
  recPerPage: number,
  page: number,
  txtSearch: string,
  msg: string,
  loading: boolean,
  status: number|string,
  order_by: string,
  order: string,
}

const access_token = localStorage.getItem("access_token");

export const useSalonListStore = defineStore("SalonList", {
  state: (): SalonListState => (
    {
      salons: [],
      totalPage: 10,
      recPerPage: 10,
      page: 1,
      msg: "",
      txtSearch: "",
      loading: false,
      status: "",
      order_by: "",
      order: "",
    }
  ),
  getters: {

  },
  actions: {
    async getSalonList(): Promise<void> {
      this.loading = true

      const res = await axios.get("salon/list-salon", {
        params: {
          page: this.page,
          txt_search: this.txtSearch,
          num_per_page: this.recPerPage,
          status: this.status,
          order_by: this.order_by,
          order: this.order,
        },
      })
      this.salons = res.data.data
      this.totalPage = res.data.total_page

      this.loading = false
      console.log(this.salons);

    },
    async getSalonListApproved(): Promise<void> {
      this.loading = true

      const res = await axios.get("salon/list-salon",)
      this.salons = res.data.data
      this.totalPage = res.data.total_page
      this.loading = false
      console.log(this.salons);

    },
    async approveSalon(selectedId: number, index: number = NaN): Promise<void> {
      return await axios
        .post(
          "salon/approve",
          { id: selectedId },
        ).then((res) => {
          if(index) {
            this.salons[index].status = 1
            this.salons[index].partner.is_approve = 1
          }
          this.msg = res.data.message
        }).catch((res) => {
        })
    },
    async activeSalon(selectedId: number, index: number): Promise<void> {
      return await axios
        .post(
          "salon/active",
          { id: selectedId },
        ).then((res) => {
          console.log(res.data.message);
          this.msg = res.data.message
          this.salons[index].status = !this.salons[index].status
        }).catch((res) => {
          this.msg = res.data.message
        })
    },
    async deleteSalon(selectedId: number): Promise<void> {
      return await axios
        .post(
          "admin/delete-salon",
          { id: selectedId },
        ).then((res) => {
          this.msg = res.data.message
          this.salons = this.salons.filter(item => {
            return item.id !== selectedId
          })
        }).catch((res) => {
          this.msg = res.data.message
        })
    },
  }
})