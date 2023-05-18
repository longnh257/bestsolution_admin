import axios from "axios";
import { defineStore } from "pinia";
import { useRoute } from "vue-router";


interface VoucherDetailState {
    voucher: any,
    txtSearch: string,
    msg: string,
    loading: boolean
}

const access_token = localStorage.getItem("access_token");

export const useVoucherDetailStore = defineStore("VoucherDetail", {
    state: (): VoucherDetailState => (
        {
            voucher: [],
            msg: "",
            txtSearch: "",
            loading: false,
        }
    ),
    getters: {

    },
    actions: {
        async getVoucherDetail(): Promise<void> {
            const route = useRoute();
            const voucher_id = route.params.voucher_id
            console.log(voucher_id);
            
            this.loading = true
            const res = await axios.get(`voucher/detail/${voucher_id}`, {
            })
            this.voucher = res.data.data
            this.loading = false
            console.log(this.voucher);
        },
    }
})