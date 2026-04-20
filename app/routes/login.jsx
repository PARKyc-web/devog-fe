import { Link } from "react-router";

export function meta() {
  return [{ title: "로그인 선택 | DEVOG" }];
}

export default function Login() {
  return (
    <main className="min-h-screen bg-[#f6f8f5] text-[#151815]">
      <header className="flex h-20 items-center justify-between px-6 sm:px-10">
        <Link
          className="text-xl font-bold tracking-wide text-[#1f6b49]"
          to="/"
        >
          DEVOG
        </Link>
        <Link
          className="rounded-md border border-[#cbd8c5] bg-white px-4 py-2 text-sm font-semibold text-[#2d332e] transition hover:border-[#2e7353] hover:text-[#1f6b49]"
          to="/"
        >
          처음으로
        </Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="text-sm font-semibold text-[#2e7353]">DEVOG</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          로그인 방식 선택
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#59615a]">
          웹 로그인은 refresh-token 쿠키 흐름을 확인하고, 앱 로그인은 토큰
          응답을 확인합니다.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            className="rounded-lg border border-[#d9e1d5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2e7353] hover:text-[#1f6b49] focus:outline-none focus:ring-2 focus:ring-[#2e7353] focus:ring-offset-2"
            to="/login/web"
          >
            <p className="text-xl font-semibold">웹 로그인</p>
            <p className="mt-3 text-sm leading-6 text-[#59615a]">
              devog-platform: web 헤더를 포함합니다.
            </p>
          </Link>
          <Link
            className="rounded-lg border border-[#d9e1d5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2e7353] hover:text-[#1f6b49] focus:outline-none focus:ring-2 focus:ring-[#2e7353] focus:ring-offset-2"
            to="/login/app"
          >
            <p className="text-xl font-semibold">앱 로그인</p>
            <p className="mt-3 text-sm leading-6 text-[#59615a]">
              기본 로그인 요청을 보냅니다.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
