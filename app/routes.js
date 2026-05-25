import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("signup", "routes/signup.jsx"),
  route("login", "routes/login-web.jsx"),
  route("service-connect", "routes/service-connect.jsx"),
  route("integration/success", "routes/integration-success.jsx"),
  route("oauth-login", "routes/oauth-login.jsx"),
  route("activity", "routes/activity.jsx"),
  route("notion", "routes/notion.jsx"),
];
