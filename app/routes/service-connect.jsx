import { useState } from "react";
import { Link } from "react-router";

const GITHUB_CONNECT_URL = "/api/integration/connect/github";
const NOTION_CONNECT_URL = "/api/integration/connect/notion";

export function meta() {
  return [{ title: "서비스 연결 | DEVOG" }];
}

async function parseResponse(response) {
  const contentType = response.headers.get("Content-Type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function getRedirectUrl(data) {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data?.data === "string") {
    return data.data;
  }

  return data?.data?.url ?? data?.url ?? "";
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

export default function ServiceConnect() {
  const [message, setMessage] = useState("");
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [isConnectingNotion, setIsConnectingNotion] = useState(false);

  async function handleServiceConnect(connectUrl, serviceName, setIsConnecting) {
    setMessage("");
    setIsConnecting(true);

    try {
      const response = await fetch(connectUrl, {
        headers: getAuthorizationHeaders(),
        redirect: "manual",
        credentials: "include",
      });
      const location = response.headers.get("Location");

      if (location) {
        window.location.href = location;
        return;
      }

      const data = await parseResponse(response);

      if (!response.ok || data.result === false) {
        throw new Error(data.message ?? `${serviceName} 연결 요청에 실패했습니다.`);
      }

      const redirectUrl = getRedirectUrl(data);

      if (!redirectUrl) {
        throw new Error(`${serviceName} 연결 URL을 찾을 수 없습니다.`);
      }

      window.location.href = redirectUrl;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : `${serviceName} 연결 중 문제가 발생했습니다.`,
      );
      setIsConnecting(false);
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

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="text-sm font-semibold text-[#2e7353]">DEVOG</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          서비스 연결
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#59615a]">
          연결할 서비스를 선택해 주세요.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            className="rounded-lg border border-[#d9e1d5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#2e7353] hover:text-[#1f6b49] focus:outline-none focus:ring-2 focus:ring-[#2e7353] focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-[#59615a]"
            disabled={isConnectingGithub}
            onClick={() =>
              handleServiceConnect(
                GITHUB_CONNECT_URL,
                "GitHub",
                setIsConnectingGithub,
              )
            }
            type="button"
          >
            <p className="text-xl font-semibold">
              {isConnectingGithub ? "GitHub 연결 중..." : "GitHub"}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#59615a]">
              GitHub 계정을 연결합니다.
            </p>
          </button>
          <button
            className="rounded-lg border border-[#d9e1d5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#2e7353] hover:text-[#1f6b49] focus:outline-none focus:ring-2 focus:ring-[#2e7353] focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-[#59615a]"
            disabled={isConnectingNotion}
            onClick={() =>
              handleServiceConnect(
                NOTION_CONNECT_URL,
                "Notion",
                setIsConnectingNotion,
              )
            }
            type="button"
          >
            <p className="text-xl font-semibold">
              {isConnectingNotion ? "Notion 연결 중..." : "Notion"}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#59615a]">
              Notion 계정을 연결합니다.
            </p>
          </button>
        </div>

        {message && (
          <p className="mt-5 rounded-md border border-[#d9e1d5] bg-white px-4 py-3 text-sm text-[#2d332e]">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
