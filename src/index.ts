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
    /**
     * Get the text after the `@` mention value nearest to the cursor position
     */
    getMentionText,
    /**
     * Get a web range object that selects the text before the cursor till the `@`
     */
    getMentionReplacementRange,
    /**
     * Get a web range object that selects the text before the cursor till the `@` and also grabs the text after the cursor
     * Can be used to replace the entire word to a mention tag instead of just the characters before the cursor.
     */
    unsafe_getMentionReplacementRange,

    /**
     * Insert the given html at the current mention's location
     * @param html
     * @returns
     */
    insertMention: (html: string) => insertMention(html),

    /**
     * Insert the given html at the current mention's location while also replacing
     * the entire word surrounded by the cursor
     * @param html
     * @returns
     */
    unsafe_insertMention: (html: string) => insertMention(html, true),
  };
}
