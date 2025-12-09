import type {
  UpNextShow,
  ScheduleBlock,
  RelatedShow,
} from "@/types/UpNextTypes";

const CMS = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_CMS_URL;

/** Convert HH:MM → minutes */
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/** Convert EST schedule time → user's local timezone */
const convertToLocalTime = (time: string, dayIndex: number): Date => {
  const [h, m] = time.split(":").map(Number);
  const local = new Date();
  local.setDate(local.getDate() - local.getDay() + dayIndex);
  local.setHours(h, m, 0, 0);
  return local;
};

/** Artwork fallback */
const getFallbackArtwork = (show: RelatedShow | null): string => {
  const slug = show?.genre?.slug || "";

  if (slug.includes("gospel")) return "/fallback/gospel.jpg";
  if (slug.includes("soul")) return "/fallback/soul.jpg";
  if (slug.includes("hip-hop")) return "/fallback/hiphop.jpg";
  if (slug.includes("rnb")) return "/fallback/rnb.jpg";

  return "/fallback/default-show.jpg";
};

/** Avatar fallback */
const getFallbackAvatar = (name?: string | null): string | null => {
  if (!name) return null;
  const initial = name.trim().charAt(0).toUpperCase();
  return `/api/avatar/${encodeURIComponent(initial)}`;
};

/** MAIN: Get next show or live show */
export async function getNextShow(): Promise<UpNextShow | null> {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const now = new Date();
  const nowDayIndex = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const allBlocks: ScheduleBlock[] = [];

  // Fetch entire week's schedule
  for (const day of days) {
    const res = await fetch(
      `${CMS}/api/schedule?where[dayOfWeek][equals]=${day}&depth=3&limit=50`,
      { cache: "no-store" }
    );

    if (!res.ok) continue;

    const json = await res.json();
    const blocks = json.docs as ScheduleBlock[];

    blocks.forEach((block) =>
      allBlocks.push({
        ...block,
        _dayIndex: days.indexOf(day),
      })
    );
  }

  if (allBlocks.length === 0) return null;

  // Sort by day then startTime
  allBlocks.sort((a, b) => {
    if (a._dayIndex !== b._dayIndex) return a._dayIndex - b._dayIndex;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  // Attempt to find LIVE NOW show
  let current: ScheduleBlock | null = null;

  for (const block of allBlocks) {
    if (block._dayIndex !== nowDayIndex) continue;

    const start = timeToMinutes(block.startTime);
    const end = timeToMinutes(block.endTime);

    if (nowMinutes >= start && nowMinutes < end) {
      current = block;
      break;
    }
  }

  // If none live, find next upcoming
  if (!current) {
    current =
      allBlocks.find(
        (b) =>
          (b._dayIndex === nowDayIndex &&
            timeToMinutes(b.startTime) > nowMinutes) ||
          b._dayIndex > nowDayIndex
      ) ?? allBlocks[0];
  }

  // Normalize "show" so it NEVER becomes undefined
  const show: RelatedShow | null = current.relatedShow ?? null;
  const host = show?.primaryHost ?? null;

  const startDate = convertToLocalTime(current.startTime, current._dayIndex);
  const endDate = convertToLocalTime(current.endTime, current._dayIndex);

  const isLive =
    current._dayIndex === nowDayIndex &&
    nowMinutes >= timeToMinutes(current.startTime) &&
    nowMinutes < timeToMinutes(current.endTime);

  return {
    showTitle: show?.title ?? current.title,
    hostName: host?.name ?? "Host",
    avatar: host?.avatar?.url ?? getFallbackAvatar(host?.name) ?? null,
    artwork:
      show?.coverArt?.url ??
      show?.bannerImage?.url ??
      getFallbackArtwork(show),

    date: current.dayOfWeek,
    start: startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    end: endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),

    startDate,
    endDate,
    isLive,

    key: `${current.dayOfWeek}-${current.startTime}-${isLive}`,
  };
}
