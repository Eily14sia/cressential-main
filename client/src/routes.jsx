/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "./layouts/dashboard";
// import Graduate from "./layouts/graduate_record";

// import Undergraduate from "./layouts/undergraduate_record";
import Type_of_Record from "./layouts/type_of_record";
import User_Management from "./layouts/user_management";
// import Graduate_Add_Record from "./layouts/graduate_record/add_record";
import Tables from "./layouts/tables";
// import Billing from "./layouts/billing";
// import RTL from "./layouts/rtl";
import Notifications from "./layouts/notifications";
import Profile from "./layouts/profile";
import LogIn from "./layouts/authentication/log_in";
import Home from "./layouts/authentication/home";
import Verifier_Portal from "./layouts/authentication/verification_portal";
import Payment from "./layouts/payment";
import Unauthorized from "./layouts/unauthorize/unauthorized_page";

import Student_record_request from "./layouts/student_record_request";
import Registrar_signature_request from "./layouts/student_signature_request";
import Student_signature_request from "./student_layouts/signature_request_table";
import Student_record_issuance from "./layouts/student_record_issuance";

import Alumni_record_request from "./layouts/alumni_record_request";
import Alumni_record_per_request from "./layouts/alumni_record_per_request";
import Alumni_record_issuance from "./layouts/alumni_record_issuance";

import Due_request from "./layouts/due_requests";

import Student_Management from "./layouts/student_management";
import Student_Management_Add from "./layouts/student_management/component/add_record";
import Student_Management_Update from "./layouts/student_management/component/update_record";
import Registrar_Management from "./layouts/registrar_management";
import Registrar_Magement_Add from "./layouts/registrar_management/component/add_record";
import Registrar_Management_Update from "./layouts/registrar_management/component/update_record";

// ================ Student ====================
import Record_request from "./student_layouts/record_request";
import Request_table from "./student_layouts/student_request_table";
import Signature_request from "./student_layouts/signature_request";

// @mui icons
import Icon from "@mui/material/Icon";
const icon1 = <Icon fontSize="small">person</Icon>;
const icon2 = <Icon fontSize="small">book</Icon>;
const icon3 = <Icon fontSize="small">school</Icon>;
const icon4 = <Icon fontSize="small">work</Icon>;
const paymentIcon = <Icon fontSize="small">receipt_long</Icon>;

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    role: [1],
    component: <Dashboard />,
  },
  {
    type: "hidden",
    name: "unauthorized",
    key: "unauthorized",
    route: "/unauthorized",
    component: <Unauthorized />,
  },
  // {
  //   type: "collapse",
  //   name: "Student Record Request",
  //   key: "undergraduate-record",
  //   icon: icon1, // Use the first icon
  //   route: "/undergraduate-record",
  //   role: [1],
  //   component: <Undergraduate />,
  // },
  // {
  //   type: "collapse",
  //   name: "Student Record Issuance",
  //   key: "registrar-student-record-issuance",
  //   icon: icon2, // Use the second icon
  //   route: "/registrar-student-record-issuance",
  //   role: [1],
  //   component: <Undergraduate />,
  // },
  {
    type: "collapse",
    name: "Student",
    key: "student",
    icon: icon2,
    collapse: [ 
      {
        type: "collapse",
        name: "Student Record Request",
        key: "registrar-student-record-request",
        icon: icon3,
        route: "/student/record-request",
        role: [1],
        component: <Student_record_request />,
      },
      // {
      //   type: "collapse",
      //   name: "Student Record per Request",
      //   key: "registrar-student-record-per-request",
      //   icon: icon4,
      //   route: "/student/record-per-request/:ctrl_number",
      //   component: <Student_record_request />,
      // },      
      {
        type: "collapse",
        name: "Student Record Issuance",
        key: "registrar-student-record-issuance",
        icon: icon4,
        route: "/student/record-issuance",
        role: [1],
        component: <Student_record_issuance />,
      },
    ],
  },  
  {
    type: "collapse",
    name: "Signature Request",
    key: "registrar-signature-request",
    icon: icon3,
    route: "/registrar/signature-request",
    role: [1],
    component: <Registrar_signature_request />,
  },
  {
    type: "collapse",
    name: "Signature Request",
    key: "signature-request",
    icon: icon3,
    route: "/signature-request",
    role: [2],
    component: <Student_signature_request />,
  },
  {
    type: "collapse",
    name: "Alumni",
    key: "alumni",
    icon: icon2,
    collapse: [ 
      {
        type: "collapse",
        name: "Alumni Record Request",
        key: "registrar-alumni-record-request",
        icon: icon3,
        route: "/alumni/record-request",
        role: [1],
        component: <Alumni_record_request />,
      },
      {
        type: "collapse",
        name: "Alumni Record per Request",
        key: "registrar-alumni-record-per-request",
        icon: icon4,
        route: "/alumni/record-per-request/:ctrl_number",
        role: [1],
        component: <Alumni_record_per_request />,
      },      
      {
        type: "collapse",
        name: "Alumni Record Issuance",
        key: "registrar-alumni-record-issuance",
        icon: icon4,
        route: "/alumni/record-issuance",
        role: [1],
        component: <Alumni_record_issuance />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Due Requests",
    key: "due-request",
    icon: icon3,
    route: "/due-request",
    role: [1],
    component: <Due_request />,
  },
  {
    type: "collapse",
    name: "Payment",
    key: "payment",
    icon: paymentIcon,
    route: "/payment",
    role: [1],
    component: <Payment />,
  },
  {
    type: "collapse",
    name: "Type of Record",
    key: "type-of-record",
    icon: <Icon fontSize="small">folder</Icon>,
    route: "/type-of-record",
    role: [1],
    component: <Type_of_Record />,
  },
  {
    type: "collapse",
    name: "Student Management",
    key: "student-management",
    icon: <Icon fontSize="small">backpack</Icon>,
    route: "/student-management",
    role: [1],
    component: <Student_Management />,    
  },
  {
    type: "collapse",
    name: "Student Management Add",
    key: "student-management-add",
    route: "/student-management/add-record",
    role: [1],
    component: <Student_Management_Add />,
  },
  {
    type: "collapse",
    name: "Student Management Update",
    key: "student-management-update",
    route: "/student-management/update-record",
    role: [1],
    component: <Student_Management_Update />,
  },
  {
    type: "collapse",
    name: "Registrar Management",
    key: "registrar-management",
    icon: <Icon fontSize="small">backpack</Icon>,
    route: "/registrar-management",
    role: [1],
    component: <Registrar_Management />,    
  },
  {
    type: "collapse",
    name: "Registrar Management Add",
    key: "registrar-management-add",
    route: "/registrar-management/add-record",
    role: [1],
    component: <Registrar_Magement_Add />,
  },
  {
    type: "collapse",
    name: "Registrar Management Update",
    key: "registrar-management-update",
    route: "/registrar-management/update-record",
    role: [1],
    component: <Registrar_Management_Update />,
  },
  {
    type: "collapse",
    name: "User Management",
    key: "user-management",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/user-management",
    role: [1],
    component: <User_Management />,
  },

  // {
  //   type: "hidden",
  //   name: "Add Record",
  //   key: "graduate-add-record",
  //   icon: <Icon fontSize="small">group</Icon>,
  //   route: "/graduate-record/add-record",
  //   role: [1],
  //   component: <Graduate_Add_Record />,
  // },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {    
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    name: "Home",
    key: "home",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/home",
    component: <Home />,
  },
  // {
  //   name: "Verifier Portal",
  //   key: "verifier-portal",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/verifier-portal",
  //   component: <Verifier_Portal />,
  // },

  //student
  {
    type: "collapse",
    name: "Record Request",
    key: "record-request",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/record-request",
    role: [2],
    component: <Record_request />,
  },
  {
    type: "collapse",
    name: "Signature Request",
    key: "signature-request-form",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/signature-request-form",
    role: [2],
    component: <Signature_request />,
  },
  {
    type: "collapse",
    name: "Request Table",
    key: "student-request-table",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/student-request-table",
    role: [2],
    component: <Request_table />,
  },
  {
    type: "collapse",
    name: "Record per Request",
    key: "record-per-request",
    icon: icon4,
    route: "/record-per-request/:ctrl_number",
    role: [1, 2],
    component: <Alumni_record_per_request />,
  }, 
  // {
  //   type: "collapse",
  //   name: "Log In",
  //   key: "log-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/log-in",
  //   component: <LogIn />,
  // },

];

export default routes;
