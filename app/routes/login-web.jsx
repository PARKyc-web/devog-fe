import { LoginForm } from "./login-form";

export function meta() {
  return [{ title: "웹 로그인 | DEVOG" }];
}

export default function WebLogin() {
  return <LoginForm />;
}
