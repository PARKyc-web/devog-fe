import { useState } from "react";
import { Link } from "react-router";

const LOGIN_URL = "/api/login";

function getToken(response, data, keys) {
  for (const key of keys) {
    const headerValue = response.headers.get(key);

    if (headerValue) {
      return headerValue;
    }
  }

  const responseBodies = data?.data ? [data, data.data] : [data];

  for (const body of responseBodies) {
    if (!body || typeof body !== "object") {
      continue;
    }

    for (const key of keys) {
      if (typeof body[key] === "string") {
        return body[key];
      }
    }
  }

  return "";
}

async function parseResponse(response) {
  const contentType = response.headers.get("Content-Type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
}

function getResponseData(data) {
  return data?.data ?? data;
}

function toBearerToken(accessToken) {
  return accessToken.startsWith("Bearer ")
    ? accessToken
    : `Bearer ${accessToken}`;
}

function saveLoginSession(accessToken, loginId) {
  if (accessToken) {
    localStorage.setItem("devogAuthorization", toBearerToken(accessToken));
  }

  if (loginId) {
    document.cookie = `loginId=${encodeURIComponent(loginId)}; path=/; SameSite=Lax`;
  }
}

export function LoginForm() {
  const [tokens, setTokens] = useState({
    accessToken: "",
    refreshToken: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setTokens({ accessToken: "", refreshToken: "" });
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      loginId: formData.get("loginId"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "devog-agent": "web-agent",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await parseResponse(response);

      if (!response.ok || data.result === false) {
        throw new Error(data.message ?? "로그인 요청에 실패했습니다.");
      }

      const responseData = getResponseData(data);

      const accessToken = getToken(response, data, [
        "access-token",
        "accessToken",
        "access_token",
        "Authorization",
      ]);
      const refreshToken = getToken(response, data, [
        "refresh-token",
        "refreshToken",
        "refresh_token",
      ]);

      saveLoginSession(accessToken, responseData.loginId);
      setTokens({ accessToken, refreshToken });
      setMessage(
        responseData.loginId
          ? `${responseData.loginId} 웹 로그인 요청을 보냈습니다. refresh-token 쿠키를 확인해 주세요.`
          : "웹 로그인 요청을 보냈습니다. refresh-token 쿠키를 확인해 주세요.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "로그인 중 문제가 발생했습니다.",
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
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          웹 로그인
        </h1>
        <p className="mt-4 text-base leading-7 text-[#59615a]">
          devog-agent 헤더에 web-agent를 담아 로그인합니다.
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
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button
            className="h-12 w-full rounded-md bg-[#1f6b49] px-4 text-base font-semibold text-white transition hover:bg-[#18573b] disabled:cursor-not-allowed disabled:bg-[#8fa99b]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "요청 중..." : "로그인"}
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-md border border-[#d9e1d5] bg-white px-4 py-3 text-sm text-[#2d332e]">
            {message}
          </p>
        )}

        <div className="mt-5 space-y-3 rounded-md border border-[#d9e1d5] bg-white p-4 text-sm">
          <div>
            <p className="font-semibold text-[#2d332e]">access-token</p>
            <p className="mt-1 break-all text-[#59615a]">
              {tokens.accessToken || "아직 받은 토큰이 없습니다."}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#2d332e]">refresh-token</p>
            <p className="mt-1 break-all text-[#59615a]">
              {tokens.refreshToken || "웹 로그인에서는 쿠키로 내려올 수 있습니다."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
