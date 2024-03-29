import { defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: "Home",
        pageName: "salon-list",
        title: "Salon",
      },
      {
        icon: "Calendar",
        pageName: "booking-list",
        title: "Booking",
      },
      {
        icon: "Tag",
        pageName: "voucher-list",
        title: "Voucher",
      },
      {
        icon: "Image",
        pageName: "banner-list",
        title: "Banner",
      },
      {
        icon: "Film",
        pageName: "guide-list",
        title: "Guide",
      },
    ],
  }),
});
