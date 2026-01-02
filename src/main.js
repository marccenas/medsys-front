import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/base.css";

/* =========================
   Font Awesome Setup
========================= */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faEnvelope,
  faLock,
  faShieldHalved,
  faUserDoctor,
  faUserGraduate,
  faUserNurse,
  faUserShield,
  faStethoscope,
  faUsers,
  faGraduationCap,
  faPills,
  faPersonWalking,
  faCommentMedical,
  faXRay,
  faBuilding,
  faUsersGear,
  faMoneyBillWave,
  faShield,
  faRightFromBracket,
  faGauge,
  faBell,
  faPlus,
  faMagnifyingGlass,
  faFileInvoiceDollar,
  faHospitalUser,
  faCalendarCheck,
  faChartColumn,
  faUserGear,
  faGear,
  faKey,
  faWandMagicSparkles,
  faCheck,
  faDownload,
  faChevronDown,
  faAngleLeft,
  faAngleRight,
  faNotesMedical,
  faClipboardList,
  faChartLine,
  faFileArrowDown,
  faFlaskVial
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faEnvelope,
  faLock,
  faShieldHalved,
  faUserDoctor,
  faUserGraduate,
  faUserNurse,
  faUserShield,
  faStethoscope,
  faUsers,
  faGraduationCap,
  faPills,
  faPersonWalking,
  faCommentMedical,
  faFileInvoiceDollar,
  faXRay,
  faClipboardList,
  faWandMagicSparkles,
  faBuilding,
  faUsersGear,
  faMoneyBillWave,
  faShield,
  faRightFromBracket,
  faGauge,
  faBell,
  faPlus,
  faMagnifyingGlass,
  faHospitalUser,
  faCalendarCheck,
  faChartColumn,
  faUserGear,
  faGear,
  faKey,
  faCheck,
  faDownload,
  faChevronDown,
  faAngleLeft,
  faAngleRight,
  faNotesMedical,
  faFileArrowDown,
  faFlaskVial,
  faChartLine
);

/* =========================
   App Init
========================= */
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");
