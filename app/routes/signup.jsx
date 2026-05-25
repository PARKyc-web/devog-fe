import { useState } from "react";
import { Link } from "react-router";

const SIGN_UP_URL = "/api/member/sign-up";

export function meta() {
  return [{ title: "회원가입 | DEVOG" }];
}

export default function Signup() {
  const [message, setMessage] = useState("");
  const [signUpResult, setSignUpResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSignUpResult(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      loginId: formData.get("loginId"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(SIGN_UP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || data.result === false) {
        throw new Error(data.message ?? "회원가입 요청에 실패했습니다.");
      }

      setSignUpResult({
        result: data.result,
        loginId: data.data?.loginId ?? "",
      });
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "회원가입 중 문제가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center px-6 py-16 sm:px-10">
        <p className="text-sm font-semibold text-[#2e7353]">DEVOG</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">회원가입</h1>
        <p className="mt-4 text-base leading-7 text-[#59615a]">
          사용할 아이디와 비밀번호를 입력해 주세요.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="loginId">
              아이디
            </label>
            <input
              className="h-12 w-full rounded-md border border-[#cbd8c5] bg-white px-4 text-base outline-none transition focus:border-[#2e7353] focus:ring-2 focus:ring-[#2e7353]/20"
              id="loginId"
              name="loginId"
              type="text"
              autoComplete="username"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="password">
              비밀번호
            </label>
            <input
              className="h-12 w-full rounded-md border border-[#cbd8c5] bg-white px-4 text-base outline-none transition focus:border-[#2e7353] focus:ring-2 focus:ring-[#2e7353]/20"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button
            className="h-12 w-full rounded-md bg-[#1f6b49] px-4 text-base font-semibold text-white transition hover:bg-[#18573b] disabled:cursor-not-allowed disabled:bg-[#8fa99b]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "요청 중..." : "가입하기"}
          </button>
        </form>

        {signUpResult && (
          <div className="mt-5 space-y-2 rounded-md border border-[#d9e1d5] bg-white px-4 py-3 text-sm text-[#2d332e]">
            <p>성공여부: {signUpResult.result ? "성공" : "실패"}</p>
            <p>회원가입한 아이디: {signUpResult.loginId}</p>
          </div>
        )}

        {message && (
          <p className="mt-5 rounded-md border border-[#d9e1d5] bg-white px-4 py-3 text-sm text-[#2d332e]">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
