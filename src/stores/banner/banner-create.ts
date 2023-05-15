import axios from "axios";
import { defineStore } from "pinia";

interface BannerCreateState {
    image: any,
    image_vi: any,
    thumbnail: any,
    type : any
    video : any
    content : any
}

export const useBannerCreateStore = defineStore("BannerCreate", {
    state: (): BannerCreateState => (
        {
            image: "",
            image_vi: "",
            thumbnail: "",
            type: 'image',
            video : "",
            content : "",
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

            fd.append("image", this.image);
            fd.append("image_vi", this.image_vi);
            fd.append("thumbnail", this.thumbnail);
            fd.append("type", this.type);
            fd.append("video", this.video);
            fd.append("content", this.content);


            return await axios
                .post(`banner/add-guide`, fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
        }
    }
}) 