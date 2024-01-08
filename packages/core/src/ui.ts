import Squire from "squire-rte";
import { createMentionUtils } from "./index";
import { nanoid } from "nanoid";
import mitt from "mitt";

type FindUserMethod = (mentionText: string) => any[] | Promise<any[]>;
type FormatMentionHTML = (html: string) => string;

export function addMentionUI(
  editor: Squire,
  {
    findUsers,
    formatMentionHTML,
  }: {
    findUsers: FindUserMethod;
    formatMentionHTML: FormatMentionHTML;
  }
) {
  const { getMentionText, insertMention } = createMentionUtils(editor);
  const emitter = mitt();
  const editorID = nanoid();

  const rootElement = editor.getRoot();
  const parentContainer = rootElement.parentNode;
  const html = String.raw;

  const containerID = `squire-editor-${editorID}`;

  const containerNode = document.createElement("div");
  containerNode.classList.add("squire-rte-mention-container");
  containerNode.id = containerID;
  containerNode.innerHTML = html`
    <div class="squire-rte-mention-wrapper" style="display:none"></div>
  `;
  parentContainer?.appendChild(containerNode);

  emitter.on("users", (data) => {
    const users = <any[]>data;
    const wrapperNode = <HTMLDivElement>(
      containerNode.querySelector(".squire-rte-mention-wrapper")
    );

    wrapperNode!.style.display = "none";
    wrapperNode!.innerHTML = "";

    if (users.length > 0) {
      users.forEach((user) => {
        const userNode = document.createElement("div");
        userNode.addEventListener("click", () => {
          const userHTML = formatMentionHTML(user);
          wrapperNode!.style.display = "none";
          insertMention(userHTML);
        });
        userNode.classList.add("squire-mention-item");
        userNode.role = "button";
        userNode.textContent = user.label;
        wrapperNode?.appendChild(userNode);
      });
      wrapperNode!.style.display = "block";
    } else {
      for (let child of wrapperNode?.childNodes || []) {
        wrapperNode?.removeChild(child);
      }
    }
  });

  editor.addEventListener("input", async () => {
    const mentionText = getMentionText();
    const result = await findUsers(mentionText);
    emitter.emit("users", result);
  });

  editor.addEventListener("cursor", () => {
    const position = editor.getCursorPosition();
    containerNode.style.top = position.y + position.height + "px";
    containerNode.style.left = position.x + "px";
  });
}
