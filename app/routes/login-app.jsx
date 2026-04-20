import { LoginForm } from "./login-form";

export function meta() {
  return [{ title: "앱 로그인 | DEVOG" }];
}

export default function AppLogin() {
  return <LoginForm platform="app" />;
}
