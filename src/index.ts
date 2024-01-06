import Squire from "squire-rte";

/**
 * Returns a set of utilities to help add mention functionality to squire-rte
 * @param editor
 * @returns
 */
export function createMentionUtils(editor: Squire) {
  editor.customEvents.add("mention");

  function getMentionText(): string {
    const range = editor.getSelection();
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    let mentionText = "";

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const text = startContainer.textContent;
      if (!text) return "";

      const beforeText = text.slice(0, startOffset);

      // Find the last index of '@' symbol before the cursor position
      const lastMentionIndex = beforeText.lastIndexOf("@");

      if (lastMentionIndex !== -1) {
        mentionText = beforeText.slice(lastMentionIndex + 1);
      }
    }

    return mentionText;
  }

  function getMentionReplacementRange(mentionText: string) {
    const range = editor.getSelection();
    const startContainer = range.startContainer;
    const startOffset = range.startOffset - 1;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      range.setEnd(range.endContainer, range.startOffset);
      range.setStart(range.startContainer, startOffset - mentionText.length);
    }

    return range;
  }

  function unsafe_getMentionReplacementRange(mentionText: string) {
    const range = editor.getSelection();
    const startContainer = range.startContainer;
    const startOffset = range.startOffset - 1;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const text = startContainer.textContent;
      let remainingText = text ? text.slice(startOffset + 1) : "";
      if (remainingText.startsWith(" ")) {
        remainingText = "";
      } else {
        remainingText = remainingText.split(" ")[0];
      }
      range.setEnd(
        range.endContainer,
        range.startOffset + remainingText.length
      );
      range.setStart(range.startContainer, startOffset - mentionText.length);
    }

    return range;
  }

  function insertMention(mentionHTML: string, unsafe = false) {
    const mentionText = getMentionText();
    let replacementRange;

    if (unsafe) {
      replacementRange = getMentionReplacementRange(mentionText);
    } else {
      replacementRange = unsafe_getMentionReplacementRange(mentionText);
    }

    const formattedMention = mentionHTML;
    editor.setSelection(replacementRange);
    editor.insertHTML(formattedMention);
    editor.blur();
    editor.focus();
  }

  return {
    getMentionText,
    getMentionReplacementRange,
    unsafe_getMentionReplacementRange,
    insertMention: (html: string) => insertMention(html),
    unsafe_insertMention: (html: string) => insertMention(html, true),
  };
}
