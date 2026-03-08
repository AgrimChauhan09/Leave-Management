import HomeView from "./views/HomeView.vue";
import LoginView from "./views/LoginView.vue";
import SignupView from "./views/SignupView.vue";
import EmployeeView from "./views/EmployeeView.vue";
import EmployerView from "./views/EmployerView.vue";

export const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "login", component: LoginView },
  { path: "/signup", name: "signup", component: SignupView },
  {
    path: "/employee",
    name: "employee",
    component: EmployeeView,
    meta: { requiresAuth: true, role: "employee" }
  },
  {
    path: "/employer",
    name: "employer",
    component: EmployerView,
    meta: { requiresAuth: true, role: "employer" }
  }
];

