import { create } from "zustand";

type CampaignsFilter = "all" | "google" | "instagram" | "facebook";
type TimelineDate = {
  startDate: Date;
  endDate: Date;
};

export type Timeline =
  | "Last 24 Hours"
  | "Last 7 Days"
  | "Last 30 Days"
  | "Custom";
export const timelineOptions: Timeline[] = [
  "Last 24 Hours",
  "Last 7 Days",
  "Last 30 Days",
  "Custom",
];

type TimelineFilterOptions = {
  name: Timeline;
  timeline: TimelineDate;
};

const defaultTimelineFilterOptions: TimelineFilterOptions = {
  name: "Last 24 Hours",
  timeline: {
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
};

type MetricsPoints = {
  title: string;
  value: number | string;
  percentage: number;
  rate: "increase" | "decrease" | "stable";
};

type MetricsStore = {
  campaignsStarted: boolean;
  timeline: TimelineFilterOptions;
  customTimeline: TimelineDate | null;
  campaignsFilter: CampaignsFilter;
  campaigns: null | any[];
  metricsPoints: MetricsPoints[];
  actions: {
    setCampaignsStarted: (started: boolean) => void;
    setCampaignsFilter: (filter: CampaignsFilter) => void;
    setTimeline: (timeline: Timeline) => void;
  };
};

const defaultMetricsPoints: MetricsPoints[] = [
  {
    title: "Revenue",
    value: "$12,450",
    percentage: 12,
    rate: "increase",
  },

  {
    title: "Total Ad Spend",
    value: "$5,200",
    percentage: 5,
    rate: "increase",
  },
  {
    title: "Total Conversion",
    value: 325,
    percentage: -8,
    rate: "decrease",
  },
  {
    title: "Total ROAS",
    value: "2.3x",
    percentage: 15,
    rate: "increase",
  },
];

const useMetricsStore = create<MetricsStore>((set, get) => ({
  campaignsStarted: false,
  campaignsFilter: "all",
  campaigns: null,
  customTimeline: null,
  timeline: defaultTimelineFilterOptions,
  metricsPoints: defaultMetricsPoints,
  actions: {
    setCampaignsStarted: (started) => set({ campaignsStarted: started }),
    setCampaignsFilter: (filter) => set({ campaignsFilter: filter }),
    setTimeline: (timeline: Timeline) => {
      switch (timeline) {
        case "Last 24 Hours":
          set({
            timeline: {
              name: "Last 24 Hours",
              timeline: {
                startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
                endDate: new Date(),
              },
            },
          });

          break;
        case "Last 7 Days":
          set({
            timeline: {
              name: "Last 7 Days",
              timeline: {
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(),
              },
            },
          });
          break;
        case "Last 30 Days":
          set({
            timeline: {
              name: "Last 30 Days",
              timeline: {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                endDate: new Date(),
              },
            },
          });
          break;
        case "Custom":
          // if (!get().customTimeline) return;
          set({
            timeline: {
              name: "Custom",
              timeline: get().customTimeline as TimelineDate,
            },
          });
          break;
        default:
          set({
            timeline: {
              name: "Last 24 Hours",
              timeline: {
                startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
                endDate: new Date(),
              },
            },
          });
          break;
      }
    },
  },
}));

export default useMetricsStore;
