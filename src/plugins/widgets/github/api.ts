import { Activity } from "react-activity-calendar";

const API_URL = "https://github-contributions-api.jogruber.de/v4";
const CACHE_TTL_MS = 60 * 1000;

type GitHubCalendarResponse = {
  contributions: Activity[];
};

type CacheEntry = {
  fetchedAt: number;
  data: Activity[];
};

const pendingRequests = new Map<string, Promise<Activity[]>>();

const cacheKey = (username: string, year: string) =>
  `github-calendar:${username}:${year}`;

const readCache = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  return JSON.parse(cached) as CacheEntry;
};

const writeCache = (key: string, data: Activity[]) => {
  localStorage.setItem(key, JSON.stringify({ fetchedAt: Date.now(), data }));
};

export const fetchGitHubCalendar = async (username: string, year = "last") => {
  const key = cacheKey(username, year);
  const cached = readCache(key);

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const pendingRequest = pendingRequests.get(key);
  if (pendingRequest) return pendingRequest;

  const request = (async () => {
    const response = await fetch(`${API_URL}/${username}?y=${year}`, {
      headers: { "cache-control": "no-cache" },
    });

    if (!response.ok) {
      throw new Error(
        `Fetching GitHub contribution data for "${username}" failed.`,
      );
    }

    const data = (await response.json()) as GitHubCalendarResponse;
    writeCache(key, data.contributions);
    return data.contributions;
  })();

  pendingRequests.set(key, request);

  try {
    return await request;
  } catch (error) {
    if (cached) return cached.data;
    throw error;
  } finally {
    pendingRequests.delete(key);
  }
};
