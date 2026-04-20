import { RoutePage } from "./route-page";

export function meta() {
  return [{ title: "활동조회 | DEVOG" }];
}

export default function Activity() {
  return (
    <RoutePage
      title="활동조회"
      description="DEVOG 활동 기록을 확인하기 위한 화면입니다."
    />
  );
}
