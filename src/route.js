import { createRouter, createWebHistory } from "vue-router";
import { getAuth,onAuthStateChanged } from "firebase/auth";
import Authenticate from "./pages/Authenticate";
import Home from "./pages/Home";
import Redirect from "./pages/Redirect";
const routes = [
  { path: "/", component: Redirect },
  { path: "/auth", component: Authenticate },
  {
    path: "/home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  { path: "/:catchAll(.*)", component: Redirect },
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
});
const getLoggedUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
        getAuth(),
        (user) =>{
            removeListener()
            resolve(user)
        },
        reject
    )
  });
};
// before each route
router.beforeEach(async(to, from, next) => {
  if (to.matched.some((record) =>  record.meta.requiresAuth)) {
    // console.log(getAuth().currentUser);
    if (await getLoggedUser()) {
      next();
    } else {
      next("/auth");
    }
  } else {
    next();
  }
});

export default router;
