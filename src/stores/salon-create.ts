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
        staffs: Staff[],
        services: Service[],
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
                staffs: [
                    {
                        name: "",
                        phone: "",
                        avatar: ""
                    }
                ],
                services: [
                    {
                        name: "",
                        price: "",
                        avatar: ""
                    }
                ],
            },
        }),
    getters: {

    },
    actions: {
        addService() {
            this.data.services.push({ name: "", price: "", avatar: "" });
            console.log(this.data.services);
            
        },
        
        addStaff() {
            this.data.staffs.push({ name: "", phone: "", avatar: "" })
            console.log(this.data.staffs);
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
    }
}) 