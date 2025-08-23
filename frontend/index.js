// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.
// 1. Define route components.
import { login } from "./pages/login.js";
import { Register } from "./pages/register.js";
import { home } from "./pages/home.js";
import { ADMIN } from "./pages/admin.js";
import { STUDENT } from "./pages/student.js";
import { admin_subject } from "./pages/adm_subject.js";
import { adm_stu } from "./pages/adm_stu.js";
import { chapt } from "./pages/adm_chapter.js";
import { admin_chapters } from "./pages/adm_chapters_all.js";
import { adm_qz } from "./pages/adm_quiz.js";
import { adm_create_qz } from "./pages/adm_create_quiz.js";
import { admin_question } from "./pages/adm_ques.js";
import { admin_qt } from "./pages/adm_qt.js";
import { st_sbj } from "./pages/stu_subject.js";
import { stu_chapter } from "./pages/stu_chapters.js";
import { st_chapters } from "./pages/st_chapter.js";
import { stu_quizs } from "./pages/stu_quiz.js";
import { st_quizs } from "./pages/st_quiz.js";
import { stu_question } from "./pages/stu_ques.js";
import { st_question } from "./pages/st_ques.js";
import { admin_sts } from "./pages/admin_st.js";
import { admin_stat } from "./pages/admin_stats.js";
import { adm_stat } from "./pages/adm_stats.js";
import { stu_stat } from "./pages/stu_stats.js";
import { st_stat } from "./pages/st_stats.js";
import { search_admins } from "./pages/search_admin.js";
import { admin_sers } from "./pages/adm_ser.js";
// These can be imported from other files.
const Foo = { template: "<div>foo</div>" };
const Bar = { template: "<div>bar</div>" };

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: "/foo", component: Foo },
  { path: "/login", component: login },
  { path: "/register", component: Register },
  { path: "/", component: home },
  { path: "/bar", component: Bar },
  {
    path: "/admin",
    component: ADMIN,
    children: [
      { path: "/adm_subject", component: admin_subject },
      { path: "/adm_stu", component: adm_stu,
        children:[{path:"students",component:admin_sts}]
      },
      { path: "/adm_stats", component: admin_stat,
        children:[{path:"stats",component:adm_stat}]
      },
      { path: "/adm_search", component: search_admins,
        children:[{path:"search",component:admin_sers}]
       }
    ],
  },
  {
    path: "/adm_chapt/:sub_id",
    component: chapt,
    children: [{ path: "chapters", component: admin_chapters }],
  },
  {
    path: "/adm_quiz/:chap_id",
    component: adm_qz,
    children: [{ path: "quiz", component: adm_create_qz }],
  },
  {
    path: "/adm_ques/:quiz_id",
    component: admin_question,
    children: [{ path: "questions", component: admin_qt }],
  },
  {
    path: "/student",
    component: STUDENT,
    children: [
      { path: "/stu_subject", component: st_sbj },
      { path: "/stu_stats", component: stu_stat, 
        children:[{path:'stat', component:st_stat}]
      },
    ],
  },
  {
    path: "/stu_chapt/:sub_id",
    component: stu_chapter,
    children: [{ path: "chapt", component: st_chapters }],
  },
  {
    path: "/stu_quiz/:chap_id",
    component: stu_quizs,
    children: [{ path: "quiz", component: st_quizs }],
  },
  {
    path: "/stu_ques/:quiz_id",
    component: stu_question,
    children: [{ path: "ques", component: st_question }],
  },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes, // short for `routes: routes`
});

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
  router,
}).$mount("#app");

// Now the app has started!
