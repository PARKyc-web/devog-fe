import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";

const weekLabels = ["일", "월", "화", "수", "목", "금", "토"];
const levelStyles = [
  "bg-[#ebeee8]",
  "bg-[#cce8d6]",
  "bg-[#8ccda5]",
  "bg-[#4f9d6f]",
  "bg-[#1f6b49]",
];
const activityTypes = [
  "커밋 작성",
  "이슈 정리",
  "PR 리뷰",
  "notion 작성",
  "활동 기록 업데이트",
];

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getActivityCount(date) {
  if (date.getMonth() === 3 && date.getDate() === 30) {
    return 4;
  }

  const seed =
    date.getFullYear() * 13 + (date.getMonth() + 1) * 17 + date.getDate() * 7;
  return seed % 6 === 0 ? 0 : seed % 5;
}

function getPeriodDays(startMonth, endMonth) {
  const firstDate = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);
  const lastDate = new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);
  const cells = [];

  for (let i = 0; i < firstDate.getDay(); i += 1) {
    cells.push(null);
  }

  for (
    let date = new Date(firstDate);
    date <= lastDate;
    date.setDate(date.getDate() + 1)
  ) {
    const currentDate = new Date(date);
    const count = getActivityCount(date);

    cells.push({
      count,
      date: currentDate,
      day: currentDate.getDate(),
      level: Math.min(count, 4),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function formatMonth(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function getRecentMonths(endMonth) {
  return [-2, -1, 0].map(
    (amount) => new Date(endMonth.getFullYear(), endMonth.getMonth() + amount, 1),
  );
}

function getActivityItems(day) {
  if (!day || day.count === 0) {
    return [];
  }

  return Array.from({ length: day.count }, (_, index) => ({
    id: `${getDateKey(day.date)}-${index}`,
    title: activityTypes[(day.day + index) % activityTypes.length],
    time: `${String(9 + index * 2).padStart(2, "0")}:00`,
  }));
}

function getHeatmapDays(days, startMonth) {
  let column = 0;
  let previousDay;

  return days.filter(Boolean).map((day) => {
    if (previousDay && day.date.getDay() === 0) {
      column += 1;
    }

    if (
      day.day === 1 &&
      (day.month !== startMonth.getMonth() ||
        day.year !== startMonth.getFullYear())
    ) {
      column += 1;
    }

    previousDay = day;

    return {
      ...day,
      column,
      row: day.date.getDay(),
    };
  });
}

export function meta() {
  return [{ title: "활동조회 | DEVOG" }];
}

export default function Activity() {
  const [endMonth, setEndMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    getDateKey(new Date()),
  );
  const [hasMoreActivities, setHasMoreActivities] = useState(false);
  const activityListRef = useRef(null);
  const months = useMemo(() => getRecentMonths(endMonth), [endMonth]);
  const startMonth = months[0];
  const latestMonth = months[months.length - 1];
  const days = useMemo(
    () => getPeriodDays(startMonth, latestMonth),
    [startMonth, latestMonth],
  );
  const heatmapDays = useMemo(
    () => getHeatmapDays(days, startMonth),
    [days, startMonth],
  );
  const totalCount = days.reduce((sum, day) => sum + (day?.count ?? 0), 0);
  const availableDays = days.filter(Boolean);
  const selectedDay =
    availableDays.find((day) => getDateKey(day.date) === selectedDateKey) ??
    availableDays[availableDays.length - 1];
  const selectedActivities = getActivityItems(selectedDay);

  function updateActivityScrollHint() {
    const list = activityListRef.current;

    if (!list) {
      return;
    }

    const isScrollable = list.scrollHeight > list.clientHeight;
    const isAtBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;

    setHasMoreActivities(isScrollable && !isAtBottom);
  }

  useEffect(() => {
    const frameId = requestAnimationFrame(updateActivityScrollHint);

    return () => cancelAnimationFrame(frameId);
  }, [selectedDateKey, selectedActivities.length]);

  function movePeriod(amount) {
    setEndMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
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

      <section className="mx-auto flex w-full max-w-5xl flex-col px-6 pb-16 pt-10 sm:px-10">
        <p className="text-sm font-semibold text-[#2e7353]">DEVOG</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          활동조회
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#59615a]">
          최근 3개월의 활동 이력을 확인할 수 있습니다.
        </p>

        <div className="mt-8 rounded-lg border border-[#d9e1d5] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#59615a]">조회 기간</p>
              <h2 className="mt-1 text-2xl font-semibold">
                {formatMonth(startMonth)} - {formatMonth(latestMonth)}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                aria-label="이전 3개월"
                className="h-10 w-10 rounded-md border border-[#cbd8c5] text-xl font-semibold leading-none transition hover:border-[#2e7353] hover:text-[#1f6b49]"
                onClick={() => movePeriod(-3)}
                type="button"
              >
                ‹
              </button>
              <button
                aria-label="다음 3개월"
                className="h-10 w-10 rounded-md border border-[#cbd8c5] text-xl font-semibold leading-none transition hover:border-[#2e7353] hover:text-[#1f6b49]"
                onClick={() => movePeriod(3)}
                type="button"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="overflow-x-auto">
              <div className="grid min-w-max grid-cols-[32px_auto] gap-3">
                <div className="grid grid-rows-7 gap-1.5 text-xs font-semibold text-[#59615a]">
                  {weekLabels.map((label) => (
                    <span className="flex h-7 items-center" key={label}>
                      {label}
                    </span>
                  ))}
                </div>

                <div className="grid grid-rows-7 auto-cols-[28px] gap-1.5">
                  {heatmapDays.map((day) => (
                    <button
                      aria-label={`${formatDate(day.date)} 활동 ${day.count}건`}
                      className={`flex h-7 w-7 items-center justify-center rounded-sm text-[11px] font-semibold text-[#151815] transition hover:ring-2 hover:ring-[#2e7353]/40 focus:outline-none focus:ring-2 focus:ring-[#2e7353] ${
                        getDateKey(day.date) === getDateKey(selectedDay.date)
                          ? "ring-2 ring-[#151815]"
                          : ""
                      } ${levelStyles[day.level]}`}
                      key={day.date.toISOString()}
                      onClick={() => setSelectedDateKey(getDateKey(day.date))}
                      style={{
                        gridColumn: day.column + 1,
                        gridRow: day.row + 1,
                      }}
                      title={`${formatDate(day.date)} 활동 ${day.count}건`}
                      type="button"
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="self-start rounded-lg border border-[#e1e7dd] bg-[#fbfcfa] p-4">
              <p className="text-sm font-semibold text-[#59615a]">선택한 날짜</p>
              <h3 className="mt-1 text-xl font-semibold">
                {formatDate(selectedDay.date)}
              </h3>
              <p className="mt-2 text-sm text-[#59615a]">
                활동 {selectedDay.count}건
              </p>

              <div className="relative mt-5">
                <div
                  className="h-[150px] space-y-3 overflow-y-auto pr-1"
                  onScroll={updateActivityScrollHint}
                  ref={activityListRef}
                >
                  {selectedActivities.length > 0 ? (
                    selectedActivities.map((activity) => (
                      <div
                        className="rounded-md border border-[#d9e1d5] bg-white p-3"
                        key={activity.id}
                      >
                        <p className="text-sm font-semibold text-[#2d332e]">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-xs text-[#59615a]">
                          {activity.time}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-md border border-[#d9e1d5] bg-white p-3 text-sm text-[#59615a]">
                      표시할 활동이 없습니다.
                    </p>
                  )}
                </div>

                {hasMoreActivities && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#fbfcfa] via-[#fbfcfa]/90 to-transparent pb-1 pt-8 text-[#1f6b49]"
                  >
                    <span className="rounded-full border border-[#cbd8c5] bg-white px-2 text-sm font-bold shadow-sm">
                      ↓
                    </span>
                  </div>
                )}
              </div>
            </aside>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-[#e6ebe3] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[#2d332e]">
              최근 3개월 활동 {totalCount}건
            </p>
            <div className="flex items-center gap-2 text-xs text-[#59615a]">
              <span>적음</span>
              {levelStyles.map((style) => (
                <span
                  className={`h-4 w-4 rounded-sm ${style}`}
                  key={style}
                />
              ))}
              <span>많음</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
