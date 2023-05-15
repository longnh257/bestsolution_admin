import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/SideMenu/SideMenu.vue";
import DashBoard from "../pages/DashBoard.vue";
import Login from "../pages/Login.vue";
import SalonList from "../pages/Salon/List/List.vue";
import SalonCreate from "../pages/Salon/Create.vue";
import SalonDetail from "../pages/Salon/Detail.vue";
import SalonEdit from "../pages/Salon/Edit.vue";
import BookingList from "../pages/Booking/List/List.vue";
import BookingDetail from "../pages/Booking/Detail.vue";
import VoucherList from "../pages/Voucher/List/List.vue";
import VoucherDetail from "../pages/Voucher/Detail.vue";
import VoucherCreate from "../pages/Voucher/Create.vue";
import BannerList from "../pages/Banner/List/List.vue";
import GuideList from "../pages/Banner/List/GuideList.vue";
import BannerCreate from "../pages/Banner/Create.vue";
import GuideCreate from "../pages/Banner/GuideCreate.vue";
import PageNotFound from "../pages/Error/404.vue";
import auth from '../middleware/auth';
import { BANNER_TYPE_BANNER, BANNER_TYPE_GUIDE } from "../constant";

const routes = [
  {
    path: "/",
    component: SideMenu,
    meta: {
      middleware: [auth],
    },
    children: [
      {
        path: "/dashboard",
        name: "side-menu-page-1",
        component: DashBoard,
      },
      {
        path: "salon",
        children: [
          {
            path: "",
            name: "salon-list",
            component: SalonList,
          },
          {
            path: "create",
            name: "salon-create",
            component: SalonCreate,
          },
          {
            path: "detail/:salon_id",
            name: "salon-detail",
            component: SalonDetail,
          },
          {
            path: "edit/:salon_id",
            name: "salon-edit",
            component: SalonEdit,
          },
        ]
      },
      {
        path: "booking",
        children: [
          {
            path: "",
            name: "booking-list",
            component: BookingList,
          },
          {
            path: "detail/:booking_id",
            name: "booking-detail",
            component: BookingDetail,
          },
        ]
      },
      {
        path: "voucher",
        children: [
          {
            path: "",
            name: "voucher-list",
            component: VoucherList,
          },
          {
            path: "detail/:voucher_id",
            name: "voucher-detail",
            component: VoucherDetail,
          },
          {
            path: "create",
            name: "voucher-create",
            component: VoucherCreate,
          },


        ]
      },

      /* ---------------------------------- BANNER ------------------ */
      {
        path: "banner",
        children: [
          {
            path: ``,
            name: "banner-list",
            component: BannerList,
          },
          {
            path: `guide`,
            name: "guide-list",
            component: GuideList,
          },
          {
            path: "create",
            name: "banner-create",
            component: BannerCreate,
          },
          {
            path: "guide-create",
            name: "guide-create",
            component: GuideCreate,
          },
        ]
      },
      /* ------------------------------- END BANNER ------------------ */


      {
        path: "/:PageNotFound(.*)*",
        component: PageNotFound,
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});
function nextFactory(context: any, middleware: any, index: any) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters: any) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
