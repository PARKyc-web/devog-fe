import { RoutePage } from "./route-page";

export function meta() {
  return [{ title: "GitHub 연동 실패 | DEVOG" }];
}

export default function IntegrationFail() {
  return (
    <RoutePage
      title="GitHub 연동 실패"
      description="깃허브 연동에 실패하였습니다."
    />
  );
}
