import axios from "axios";
import { defineStore } from "pinia";

interface VoucherCreateState {
    data: {
        title: string,
        code: string,
        image: any,
        start_date: string,
        expiration_date: string,
        value: string,
        type: string,
        salon_ids: any
        type_customer: string,
        description: string,

    }
}

const defaultData = {
    title: "",
    code: "",
    image: "",
    start_date: "",
    expiration_date: "",
    value: "",
    type: "1",
    salon_ids: [],
    type_customer: "1",
    description: "",
}

export const useVoucherCreateStore = defineStore("VoucherCreate", {
    state: (): VoucherCreateState => (
        {
            data: {
                title: "",
                code: "",
                image: "",
                start_date: "",
                expiration_date: "",
                value: "",
                type: "1",
                salon_ids: [],
                type_customer: "1",
                description: "",
            }
        }),
    getters: {

    },
    actions: {

        resetData() {
            for (const item in this.data) {
                this.data[item] = defaultData[item]
            }
        },

        async createVoucher() {

            console.log(this.data);
            

           /*  const fd = new FormData();


            fd.append("name", this.data.title);
         

            return await axios
                .post(`voucher/sign-up`, fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }) */
        }
    }
}) 