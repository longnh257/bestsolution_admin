import axios from "axios";
import { defineStore } from "pinia";

interface BannerCreateState {
    image: any,
    thumbnail: any,
    type : any
    content : any
    video : any
}

export const useBannerCreateStore = defineStore("BannerCreate", {
    state: (): BannerCreateState => (
        {
            image: "",
            thumbnail: "",
            type: "",
            content : "",
            video : "",
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
        },

        async createGuide() {

            const fd = new FormData();

            fd.append("thumbnail", this.thumbnail);
            fd.append("type", "video");
            fd.append("video", this.video);

            return await axios
                .post(`banner/add-banner`, fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
        }
    }
}) 