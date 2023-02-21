import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/SideMenu/SideMenu.vue";
import SimpleMenu from "../layouts/SimpleMenu/SimpleMenu.vue";
import TopMenu from "../layouts/TopMenu/TopMenu.vue";
import Page1 from "../pages/Page1.vue";
import Page2 from "../pages/Page2.vue";
import Page3 from "../pages/Page3.vue";
import Login from "../pages/Login.vue";
import Salon from "../pages/Salon.vue";
import auth from '../middleware/auth';
import log from '../middleware/log';

const routes = [
  {
    path: "/",
    component: SideMenu,
    children: [
      {
        path: "/",
        name: "side-menu-page-1",
        component: Page1,
        meta: {
          middleware: [auth],
    },
      },
      {
        path: "page-2",
        name: "side-menu-page-2",
        component: Page2,
      },
      {
        path: "/Salon",
        name: "Salon",
        component: Salon,
        meta: {
          middleware: [auth],
    },
      },
      {
        path: "page-3",
        name: "side-menu-page-3",
        component: Page3,
      },
    ],
    
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/simple-menu",
    component: SimpleMenu,
    children: [
      {
        path: "page-1",
        name: "simple-menu-page-1",
        component: Page1,
      },
      {
        path: "page-2",
        name: "simple-menu-page-2",
        component: Page2,
      },
    ],
  },
  {
    path: "/top-menu",
    component: TopMenu,
    children: [
      {
        path: "page-1",
        name: "top-menu-page-1",
        component: Page1,
      },
      {
        path: "page-2",
        name: "top-menu-page-2",
        component: Page2,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

export default router;
