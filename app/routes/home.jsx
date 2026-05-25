import { Link, useLoaderData } from "react-router";

export function meta() {
  return [
    { title: "DEVOG" },
    { name: "description", content: "DEVOG 초기 화면" },
  ];
}

const menuItems = [
  { label: "회원가입", to: "/signup" },
  { label: "로그인", to: "/login" },
  { label: "서비스 연결", to: "/service-connect" },
  { label: "OAuth 로그인", to: "/oauth-login" },
  { label: "활동조회", to: "/activity" },
  { label: "notion 작성", to: "/notion" },
];

function getCookieValue(cookieHeader, name) {
  const cookie = cookieHeader
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

export function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const hasRefreshToken = Boolean(getCookieValue(cookieHeader, "refresh-token"));
  const loginId = getCookieValue(cookieHeader, "loginId");

  return {
    loginId: hasRefreshToken ? loginId : "",
  };
}

export default function Home() {
  const { loginId } = useLoaderData();

  return (
    <main className="min-h-screen bg-[#f6f8f5] text-[#151815]">
      <header className="flex h-20 items-center justify-between px-6 sm:px-10">
        <Link
          className="text-xl font-bold tracking-wide text-[#1f6b49]"
          to="/"
        >
          DEVOG
        </Link>
        {loginId && (
          <p className="text-sm font-semibold text-[#2d332e]">{loginId}</p>
        )}
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col px-6 pb-16 pt-12 sm:px-10 sm:pt-20">
        <p className="text-sm font-semibold text-[#2e7353]">
          개발 활동을 한 곳에서 관리하세요
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          DEVOG에서 필요한 화면으로 바로 이동하세요.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[#59615a]">
          아래의 버튼을 클릭하여, 각 기능을 확인할 수 있습니다.
        </p>

        <nav className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((item) => (
            <Link
              className="flex min-h-24 items-center justify-between rounded-lg border border-[#d9e1d5] bg-white px-5 py-4 text-lg font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-[#2e7353] hover:text-[#1f6b49] focus:outline-none focus:ring-2 focus:ring-[#2e7353] focus:ring-offset-2"
              key={item.to}
              to={item.to}
            >
              <span>{item.label}</span>
              <span aria-hidden="true">›</span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
