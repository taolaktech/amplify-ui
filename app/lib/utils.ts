import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export const passwordPattern =
  /^(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/;

export const paths = new Map<string, string>();

paths.set("/dashboard", "Dashboard");

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

// export function getColorByName(name, colors) {
//   // Step 1: Generate a hash from the name
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash); // hash * 31 + char
//   }

//   // Step 2: Ensure positive index
//   const index = Math.abs(hash) % colors.length;

//   // Step 3: Return color
//   return colors[index];
// }

export const normalize = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};
