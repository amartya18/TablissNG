import { useEffect, useState } from "react";
import { Activity } from "react-activity-calendar";

import { fetchGitHubCalendar, readCachedGitHubCalendar } from "./api";

export const useGitHubCalendar = (username?: string) => {
  // Start from the last saved calendar so a new tab never shows an empty grid
  // while the network refresh is in flight.
  const [calendar, setCalendar] = useState<Activity[] | null>(() =>
    username ? readCachedGitHubCalendar(username) : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) return;

    let active = true;
    setCalendar(readCachedGitHubCalendar(username));
    setLoading(true);
    setError(null);

    fetchGitHubCalendar(username)
      .then((data) => {
        if (active) setCalendar(data);
      })
      .catch((err: unknown) => {
        if (active && err instanceof Error) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [username]);

  return { calendar, loading, error };
};
