import { RoutePage } from "./route-page";

export function meta() {
  return [{ title: "GitHub 연동 성공 | DEVOG" }];
}

export default function IntegrationSuccess() {
  return (
    <RoutePage
      title="GitHub 연동 성공"
      description="깃허브 연동에 성공하였습니다."
    />
  );
}
