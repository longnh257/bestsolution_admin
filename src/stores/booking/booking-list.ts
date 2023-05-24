import axios from "axios";
import { defineStore } from "pinia";
import { Booking } from "../../models/booking.model";
import { useRoute } from "vue-router";

interface BookingListState {
  bookings: Booking[],
  totalPage: number,
  recPerPage: number,
  page: number,
  txtSearch: string,
  msg: string,
  loading: boolean
}

export const useBookingListStore = defineStore("BookingList", {
  
  state: (): BookingListState => (
    {
      bookings: [],
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
    async getBookingList(): Promise<void> {
      this.loading = true
      const route = useRoute();
      let salon_id = route?.query?.salon_id;
      
      const res = await axios.get("admin/list-bookings", {
        params: {
          page: this.page,
          salon_id: salon_id,
          txt_search: this.txtSearch,
          num_per_page: this.recPerPage,
        },

      }).then((res) => {
        this.bookings = res.data.data
        this.totalPage = res.data.total_page

        this.loading = false
        console.log(this.bookings);
      }).catch((res) => {
        console.log(res);

        /*   this.msg = res.data.message */
        this.loading = false
      })


    },
  }
})