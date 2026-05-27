import { useState } from "react";
import { Link } from "react-router";

export function meta() {
  return [{ title: "요청 테스트 | DEVOG" }];
}

function getAuthorizationHeaders() {
  const token = localStorage.getItem("devogAuthorization");

  if (!token) {
    return {};
  }

  return {
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };
}

export default function RequestTest() {
  const [requestResult, setRequestResult] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  async function handleRequestSubmit(event) {
    event.preventDefault();
    setRequestResult("");
    setIsSendingRequest(true);

    const formData = new FormData(event.currentTarget);
    const method = formData.get("method");
    const url = formData.get("url");
    const body = formData.get("body");

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthorizationHeaders(),
          ...(method === "POST" && body
            ? { "Content-Type": "application/json" }
            : {}),
        },
        ...(method === "POST" && body ? { body } : {}),
        credentials: "include",
      });
      const text = await response.text();

      setRequestResult(
        text
          ? `${response.status} ${response.statusText}\n${text}`
          : `${response.status} ${response.statusText}`,
      );
    } catch (error) {
      setRequestResult(
        error instanceof Error
          ? error.message
          : "요청을 보내는 중 문제가 발생했습니다.",
      );
    } finally {
      setIsSendingRequest(false);
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

      <section className="mx-auto flex w-full max-w-4xl flex-col px-6 py-16 sm:px-10">
        <p className="text-sm font-semibold text-[#2e7353]">DEVOG</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          요청 테스트
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#59615a]">
          GET 또는 POST 요청을 보내고 응답을 확인합니다.
        </p>

        <form
          className="mt-8 space-y-4 rounded-lg border border-[#d9e1d5] bg-white p-5 shadow-sm"
          onSubmit={handleRequestSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
            <div className="space-y-2">
              <label className="block text-sm font-semibold" htmlFor="method">
                Method
              </label>
              <select
                className="h-12 w-full rounded-md border border-[#cbd8c5] bg-white px-3 text-base outline-none transition focus:border-[#2e7353] focus:ring-2 focus:ring-[#2e7353]/20"
                defaultValue="GET"
                id="method"
                name="method"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold" htmlFor="url">
                URL
              </label>
              <input
                className="h-12 w-full rounded-md border border-[#cbd8c5] bg-white px-4 text-base outline-none transition focus:border-[#2e7353] focus:ring-2 focus:ring-[#2e7353]/20"
                id="url"
                name="url"
                placeholder="/api/example"
                required
                type="text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="body">
              Body
            </label>
            <textarea
              className="min-h-32 w-full rounded-md border border-[#cbd8c5] bg-white px-4 py-3 text-base outline-none transition focus:border-[#2e7353] focus:ring-2 focus:ring-[#2e7353]/20"
              id="body"
              name="body"
              placeholder='{"key":"value"}'
            />
          </div>

          <button
            className="h-12 rounded-md bg-[#1f6b49] px-5 text-base font-semibold text-white transition hover:bg-[#18573b] disabled:cursor-not-allowed disabled:bg-[#8fa99b]"
            disabled={isSendingRequest}
            type="submit"
          >
            {isSendingRequest ? "요청 중..." : "요청 보내기"}
          </button>

          {requestResult && (
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border border-[#d9e1d5] bg-[#f6f8f5] px-4 py-3 text-sm leading-6 text-[#2d332e]">
              {requestResult}
            </pre>
          )}
        </form>
      </section>
    </main>
  );
}
