import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export const passwordPattern =
  /^(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/;

export const paths = new Map<string, string>();

paths.set("/dashboard", "Dashboard");
paths.set("/dashboard/company", "Company");

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
