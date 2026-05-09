import { fetchGitHubCalendar } from "./api";

const contribution = { date: "2026-05-09", count: 3, level: 2 } as const;

describe("github/api", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    rstest.stubGlobal("localStorage", {
      getItem: rstest.fn((key: string) => storage.get(key) ?? null),
      setItem: rstest.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
    });
    rstest.useFakeTimers();
    rstest.setSystemTime(new Date("2026-05-09T12:00:00Z"));
  });

  afterEach(() => {
    rstest.useRealTimers();
    rstest.restoreAllMocks();
  });

  it("uses cached calendar data for one minute", async () => {
    const fetchMock = rstest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          total: { lastYear: 3 },
          contributions: [contribution],
        }),
        { status: 200 },
      ),
    );
    rstest.stubGlobal("fetch", fetchMock);

    await expect(fetchGitHubCalendar("octocat")).resolves.toEqual([
      contribution,
    ]);
    await expect(fetchGitHubCalendar("octocat")).resolves.toEqual([
      contribution,
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://github-contributions-api.jogruber.de/v4/octocat?y=last",
      { headers: { "cache-control": "no-cache" } },
    );
  });

  it("falls back to stale cached data when refreshing fails", async () => {
    const staleContribution = { date: "2026-05-08", count: 1, level: 1 };
    localStorage.setItem(
      "github-calendar:octocat:last",
      JSON.stringify({
        fetchedAt: Date.now() - 61 * 1000,
        data: [staleContribution],
      }),
    );
    rstest.stubGlobal(
      "fetch",
      rstest.fn().mockResolvedValue(new Response("{}", { status: 429 })),
    );

    await expect(fetchGitHubCalendar("octocat")).resolves.toEqual([
      staleContribution,
    ]);
  });

  it("deduplicates simultaneous refreshes for the same user and year", async () => {
    const fetchMock = rstest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          total: { lastYear: 3 },
          contributions: [contribution],
        }),
        { status: 200 },
      ),
    );
    rstest.stubGlobal("fetch", fetchMock);

    await expect(
      Promise.all([
        fetchGitHubCalendar("octocat"),
        fetchGitHubCalendar("octocat"),
      ]),
    ).resolves.toEqual([[contribution], [contribution]]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
