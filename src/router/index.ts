import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/SideMenu/SideMenu.vue";
import SimpleMenu from "../layouts/SimpleMenu/SimpleMenu.vue";
import TopMenu from "../layouts/TopMenu/TopMenu.vue";
import Page1 from "../pages/Page1.vue";
import Login from "../pages/Login.vue";
import SalonList from "../pages/Salon/List/List.vue";
import SalonCreate from "../pages/Salon/Create.vue";
import SalonDetail from "../pages/Salon/Detail.vue";
import SalonEdit from "../pages/Salon/Edit.vue";
import auth from '../middleware/auth';

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
        component: Page1,
      },
      {
        path: "salon",
        children : [
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
function nextFactory(context : any, middleware : any, index :any) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;
  
    return (...parameters : any) => {
      // Run the default Vue Router `next()` callback first.
      context.next(...parameters);
      // Then run the subsequent Middleware with a new
      // `nextMiddleware()` callback.
      const nextMiddleware = nextFactory(context, middleware, index  + 1);
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
