import { RoutePage } from "./route-page";

export function meta() {
  return [{ title: "notion 작성 | DEVOG" }];
}

export default function Notion() {
  return (
    <RoutePage
      title="notion 작성"
      description="notion에 작성할 내용을 준비하는 화면입니다."
    />
  );
}
