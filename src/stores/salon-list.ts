import axios from "axios";
import { defineStore } from "pinia";
import { setTimeout } from "timers/promises";
import { Salon } from "../models/salon.models";

interface SalonListState {
    salons: Salon[],
    totalPage: number,
    loading: boolean
}

let access_token = localStorage.getItem("access_token");

export const useSalonListStore = defineStore("SalonList", {
    state: (): SalonListState => (
        {
            salons: [],
            totalPage:10,
            loading: false,
        }
    ),
    getters: {

    },
    actions: {
       async getSalonList(pageValue:number = 1,txtSearch:string = "",recPerPage:number = 10) : Promise<void>{
        this.loading = true

       const res = await axios.get("salon/list-salon", {
          params: {
            page: pageValue,
            txt_search: txtSearch,
            num_per_page: recPerPage,
          },
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
       
        this.salons = res.data.data
        this.totalPage = res.data.total_page
        console.log(res.data);
        
        /*   await setTimeout(function() {

        },1000) */

        this.loading = false
       },
    }
})