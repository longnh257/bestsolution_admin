import axios from "axios";
import { defineStore } from "pinia";

interface JobCreateState {
    data: {
        salon_name: string,
        title: string,
        contact_name: string,
        contact_phone: string,
        contact_email: string,
        salon_state: string,
        salon_city: string,
        salon_exists_time: string,
        customer_skin_color: string,
        income_weekly: string,
        gender: string,
        salary: string,
        salary_form: string,
        type_salary: string,
        is_shuttle: string,
        is_there_house: string,
        skills: [],
        working_time: string,
        position: string,
        position_other: string,
        short_description: string,
        experience_required: string,
        deadline_submission: string,
        description: string,
        working_form: string,
        working_term: string,
        images: any[],
    }
}

export const useJobCreateStore = defineStore("JobCreate", {
    state: (): JobCreateState => (
        {
            data: {
                salon_name: "",
                title: "",
                contact_name: "",
                contact_phone: "",
                contact_email: "",
                salon_state: "",
                salon_city: "",
                salon_exists_time: "",
                customer_skin_color: "",
                income_weekly: "",
                gender: "",
                salary: "",
                salary_form: "",
                type_salary: "",
                is_shuttle: "",
                is_there_house: "",
                skills: [],
                working_time: "",
                position: "",
                position_other: "",
                short_description: "",
                experience_required: "",
                deadline_submission: "",
                description: "",
                working_form: "",
                working_term: "",
                images: [],
            }
        }),
    getters: {

    },
    actions: {

        async createJob() {

            const fd = new FormData();

            for (let index in this.data.images) {
                fd.append("images", this.data.images[index]);
            }

            fd.append("title", this.data.title);
            fd.append("contact_phone", this.data.contact_phone);
            fd.append("salon_name", this.data.salon_name);
            fd.append("salon_city", this.data.salon_city);
            fd.append("salon_state", this.data.salon_state);

            return await axios
                .post(`salon/sign-up`, fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
        }
    }
}) 