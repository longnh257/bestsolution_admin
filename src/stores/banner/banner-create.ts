import axios from "axios";
import { defineStore } from "pinia";

interface BannerCreateState {
    image: any,
    type : any
}

export const useBannerCreateStore = defineStore("BannerCreate", {
    state: (): BannerCreateState => (
        {
            image: "",
            type: ""
        }),
    getters: {

    },
    actions: {

        async createBanner() {

            const fd = new FormData();

            fd.append("image", this.image);

            return await axios
                .post(`banner/add-banner`, fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
        }
    }
}) 