import axios from "axios";
import { defineStore } from "pinia";
import { useRoute } from "vue-router";


interface BookingDetailState {
    booking: any,
    txtSearch: string,
    msg: string,
    loading: boolean
}

const access_token = localStorage.getItem("access_token");

export const useBookingDetailStore = defineStore("BookingDetail", {
    state: (): BookingDetailState => (
        {
            booking: [],
            msg: "",
            txtSearch: "",
            loading: false,
        }
    ),
    getters: {

    },
    actions: {
        async getBookingDetail(): Promise<void> {
            const route = useRoute();
            const booking_id = route.params.booking_id
            console.log(booking_id);
            
            this.loading = true
            const res = await axios.get(`appointment/detail?id=${booking_id}`, {
                headers: {
                    Authorization: "Bearer " + access_token,
                },
            })
            this.booking = res.data.data
            this.loading = false
            console.log(this.booking);
        },
    }
})