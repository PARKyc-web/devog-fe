import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("signup", "routes/signup.jsx"),
  route("login", "routes/login.jsx"),
  route("login/app", "routes/login-app.jsx"),
  route("login/web", "routes/login-web.jsx"),
  route("oauth-login", "routes/oauth-login.jsx"),
  route("activity", "routes/activity.jsx"),
  route("notion", "routes/notion.jsx"),
];
