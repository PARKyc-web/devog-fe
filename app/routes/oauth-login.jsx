import { RoutePage } from "./route-page";

export function meta() {
  return [{ title: "OAuth 로그인 | DEVOG" }];
}

export default function OAuthLogin() {
  return (
    <RoutePage
      title="OAuth 로그인"
      description="OAuth 로그인 흐름을 확인하기 위한 화면입니다."
    />
  );
}
