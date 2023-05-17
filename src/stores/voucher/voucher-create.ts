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

            const fd = new FormData();

            fd.append("title", this.data.title);
            fd.append("code", this.data.code);
            fd.append("image", this.data.image);
            fd.append("start_date", this.data.start_date);
            fd.append("expiration_date", this.data.expiration_date);
            fd.append("value", this.data.value);
            fd.append("type", this.data.type);
            fd.append("salon_ids", JSON.stringify(this.data.salon_ids));
            fd.append("type_customer", this.data.type_customer);
            fd.append("description", this.data.description);

            return await axios
                .post(`admin/add-voucher-salons`, fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
        }
    }
}) 