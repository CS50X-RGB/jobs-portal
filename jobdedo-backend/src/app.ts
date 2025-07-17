import express from "express";
import connectDB from "./database/connection";
import routes from "./routes";
import cors from "cors";
import { responseFormatter } from "./utils/reponseFormatter";
import UserService from "./services/userService";
import RoleService from "./services/roleService";
import { RoleInterface } from "./interfaces/roleInterface";
import { PermissionCreate } from "./interfaces/permissionInterface";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(responseFormatter);
app.use("/api", routes);

connectDB();

const permissions: PermissionCreate[] = [
  {
    name: "Dashboard",
    link: "/admin/",
  },
  {
    name: "Create Users",
    link: "/admin/create",
  },
];

const roles: RoleInterface[] = [
  {
    name: "ADMIN",
  },
  {
    name: "EMPLOYEER",
  },
  {
    name: "CANDIDATE",
  },
];

const userService = new UserService();
const roleService = new RoleService();

roleService.createRoles(roles);
// roleService.createPermission(permissions);
userService.createAdmin();

export default app;
