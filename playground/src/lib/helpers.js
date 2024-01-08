import { users } from "./constants";

export function findUsers(mentionText) {
  if (!mentionText) return [];

  return users.filter((x) => {
    const nameHas = x.name?.includes(mentionText);
    const labelHas = x.label?.includes(mentionText);
    return nameHas || labelHas;
  });
}

export function formatUserMention(user) {
  return `
      <span class="rte-mention">
        <a class="bg-zinc-200 px-1 py-1 rounded-sm" href="/${user.id}"> ${user.label}</a>
      </span>
      &nbsp;
    `;
}
