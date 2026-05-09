import { useEffect, useState } from "react";
import { Activity } from "react-activity-calendar";

import { fetchGitHubCalendar } from "./api";

export const useGitHubCalendar = (username?: string) => {
  const [calendar, setCalendar] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) return;

    let active = true;
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
