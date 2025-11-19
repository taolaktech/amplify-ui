import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export const passwordPattern =
  /^(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/;

export const paths = new Map<string, string>();

paths.set("/", "Dashboard");
paths.set("", "Dashboard");
paths.set("/company", "Company");
paths.set("/campaigns", "Campaigns");
paths.set("/settings", "Subscriptions");
paths.set("/settings/integrations", "Settings");
paths.set("/settings/subscriptions", "Subscriptions");

export const generateAvatar = (name: string) => {
  const avatar = createAvatar(initials, {
    seed: name,
    backgroundColor: ["F0E6FB"],
    textColor: ["6800d7"],
    scale: 100,
    radius: 50,
    fontSize: 35,
    fontWeight: 700,
  });
  return avatar;
};

export const normalize = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export const campaignStatus: { [key: string]: string } = {
  CREATING: "pending",
  ACTIVE: "active",
  PAUSED: "paused",
  DELETED: "archived",
  PENDING_REVIEW: "pending",
  DISAPPROVED: "archived",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  UNSPECIFIED: "pending",
  READY_TO_LAUNCH: "pending",
  UNKNOWN: "pending",
  ENABLED: "active",
  REMOVED: "archived",
  PROCESSED: "pending",
  LIVE: "active",
};
