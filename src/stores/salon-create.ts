import axios from "axios";
import { defineStore } from "pinia";

interface Service {
    name: string,
    price: string,
    avatar: string
}
interface Staff {
    name: string,
    phone: string,
    avatar: string
}
interface Schedule {
    day: number,
    day_name: string,
    start_time: string,
    end_time: string,
}

interface SalonCreateState {
    data: {
        name: string,
        phone: string,
        password: string,
        salon_name: string,
        salon_email: string,
        salon_phone: string,
        salon_address: string,
        salon_description: string,
        salon_number_employees: string,
        salon_country: string,
        salon_state: string,
        salon_city: string,
        salon_zipcode: string,
        salon_timezone: string,
        salon_tz: string,
        salon_lat: string,
        salon_lng: string,
        lang: string,
        images: Blob[],
        fileList: Blob[],
        staffs: Staff[],
        services: Service[],
        schedules: Schedule[],
    }
}

export const useSalonCreateStore = defineStore("SalonCreate", {
    state: (): SalonCreateState => (
        {
            data: {
                name: "",
                phone: "",
                password: "",
                salon_name: "",
                salon_email: "",
                salon_phone: "",
                salon_address: "",
                salon_description: "",
                salon_number_employees: "",
                salon_country: "",
                salon_state: "",
                salon_city: "",
                salon_zipcode: "",
                salon_timezone: "UTC",
                salon_tz: "",
                salon_lat: "",
                salon_lng: "",
                lang: "en",
                images: [],
                fileList: [],
                staffs: [
                    {
                        name: "",
                        phone: "",
                        avatar: "",
                    }
                ],
                services: [
                    {
                        name: "",
                        price: "",
                        avatar: "",
                    }
                ],
                schedules: [
                    {
                        day: 0,
                        day_name: "Thứ 2",
                        start_time: "08:00",
                        end_time: "18:30",
                    },
                    {
                        day: 1,
                        day_name: "Thứ 3",
                        start_time: "08:00",
                        end_time: "18:30",
                    },
                    {
                        day: 2,
                        day_name: "Thứ 4",
                        start_time: "08:00",
                        end_time: "18:30",
                    },
                    {
                        day: 3,
                        day_name: "Thứ 5",
                        start_time: "08:00",
                        end_time: "18:30",
                    },
                    {
                        day: 4,
                        day_name: "Thứ 6",
                        start_time: "08:00",
                        end_time: "18:30",
                    },
                    {
                        day: 5,
                        day_name: "Thứ 7",
                        start_time: "08:00",
                        end_time: "18:30",
                    },
                    {
                        day: 6,
                        day_name: "Chủ nhật",
                        start_time: "08:00",
                        end_time: "18:30",
                    },
                ],
            },
        }),
    getters: {

    },
    actions: {
        addService() {
            this.data.services.push({ name: "", price: "", avatar: "" });

        },

        addStaff() {
            this.data.staffs.push({ name: "", phone: "", avatar: "" })
        },

        deleteService(index: any) {
            if (this.data.services.length > 1) {
                this.data.services.splice(index, 1)
            } else {
                this.data.services[index].name = ""
                this.data.services[index].price = ""

            }
        },

        deleteStaff(index: any) {
            if (this.data.staffs.length > 1) {
                this.data.staffs.splice(index, 1)
            } else {
                this.data.staffs[index].name = ""
                this.data.staffs[index].phone = ""
            }
        },

        async createSalon() {

            const fd = new FormData();

            this.data.staffs = this.data.staffs.filter(item => {
                return item.phone != '' && item.name != '' || item.phone == '' && item.name == ''
            })
            this.data.services = this.data.services.filter(item => {
                return item.price != '' && item.name != '' || item.price == '' && item.name == ''
            })
            for (let index in this.data.images) {
                fd.append("images", this.data.images[index]);
            }

            for (let index in this.data.fileList) {
                fd.append("fileList", this.data.fileList[index]);
            }
            fd.append("name", this.data.name);
            fd.append("phone", this.data.phone);
            fd.append("salon_email", this.data.salon_email);
            fd.append("password", this.data.password);
            fd.append("salon_name", this.data.salon_name);
            fd.append("salon_phone", this.data.salon_phone);
            fd.append("salon_address", this.data.salon_address);
            fd.append("salon_description", this.data.salon_description);
            fd.append("salon_country", this.data.salon_country);
            fd.append("salon_city", this.data.salon_city);
            fd.append("salon_state", this.data.salon_state);
            fd.append("salon_zipcode", this.data.salon_zipcode);
            fd.append("salon_number_employees", this.data.salon_number_employees);
            fd.append("salon_timezone", this.data.salon_timezone);
            fd.append("salon_tz", this.data.salon_tz);
            fd.append("salon_lat", this.data.salon_lat);
            fd.append("salon_lng", this.data.salon_lng);
            fd.append("lang", this.data.lang);
            fd.append("services", JSON.stringify(this.data.services));
            fd.append("staffs", JSON.stringify(this.data.staffs));
            fd.append("schedules", JSON.stringify(this.data.schedules));
           

            return await axios
                .post(`salon/sign-up`, fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
        }
    }
}) 