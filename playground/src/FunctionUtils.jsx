import { useEffect, useRef, useState } from "react";
import Squire from "squire-rte";
import createDOMPurify from "dompurify";
import { createMentionUtils } from "squire-rte-mention";
import { findUsers, formatUserMention } from "./lib/helpers";

export const FunctionalUtils = () => {
  const editorRef = useRef();
  const editorInstance = useRef();
  const [mentionList, setMentionList] = useState([]);
  const [showMention, setShowMention] = useState(false);

  useEffect(() => {
    if (!editorRef?.current) return;
    onEditorInit(editorRef.current);
  }, [editorRef]);

  const onEditorInit = (node) => {
    if (!node) return;

    const DOMPurify = createDOMPurify(window);

    const editor = new Squire(node, {
      sanitizeToDOMFragment: (html) => {
        const frag = DOMPurify.sanitize(html, {
          ALLOW_UNKNOWN_PROTOCOLS: true,
          WHOLE_DOCUMENT: false,
          RETURN_DOM: true,
          RETURN_DOM_FRAGMENT: true,
          FORCE_BODY: false,
        });

        return frag
          ? document.importNode(frag, true)
          : document.createDocumentFragment();
      },
    });

    editorInstance.current = editor;

    const mentionUtils = createMentionUtils(editor);

    editor.addEventListener("input", () => {
      const mentionText = mentionUtils.getMentionText();
      const users = findUsers(mentionText);

      if (users.length > 0) {
        // show mention list
        setShowMention(true);
        setMentionList(users);
      } else {
        // hide mention list
        setShowMention(false);
      }
    });
  };

  const onUserClick = (user) => {
    const editor = editorInstance.current;
    const mentionUtils = createMentionUtils(editor);
    const mentionHTML = formatUserMention(user);

    mentionUtils.insertMention(mentionHTML);
    // mentionUtils.unsafe_insertMention(mentionHTML);
  };

  return (
    <>
      <div className="relative">
        <div
          className="p-3 rounded-md border border-zinc-200"
          ref={editorRef}
        ></div>
        {showMention ? (
          <div>
            {mentionList.map((x) => {
              return <div onClick={() => onUserClick(x)}>{x.label}</div>;
            })}
          </div>
        ) : null}
      </div>
    </>
  );
};
