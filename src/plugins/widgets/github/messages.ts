import { defineMessages } from "react-intl";

export const messages = defineMessages({
  totalCount: {
    id: "plugins.github.totalCountLastYear",
    defaultMessage: "[count] contributions in the last year",
    description:
      "Total count text for the GitHub calendar, which covers the past 12 months",
  },
  error: {
    id: "plugins.github.error",
    defaultMessage: "Error fetching GitHub contribution data.",
    description: "Error text when GitHub calendar data cannot be loaded",
  },
});

export const tooltipMessages = defineMessages({
  activity: {
    id: "plugins.github.tooltip.activity",
    defaultMessage: "{count, number} contributions on {date}",
    description: "Tooltip text showing contribution count on a specific date",
  },
  noActivity: {
    id: "plugins.github.tooltip.noActivity",
    defaultMessage: "No contributions on {date}",
    description: "Tooltip text for days with no contributions",
  },
});
