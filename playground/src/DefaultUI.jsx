import createDOMPurify from "dompurify";
import { useEffect, useRef } from "react";
import Squire from "squire-rte";
import { addMentionUI } from "squire-rte-mention/ui";
import { findUsers, formatUserMention } from "./lib/helpers";

export function DefaultUI() {
  const editorRef = useRef();
  const editorInstance = useRef();

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

    addMentionUI(editor, {
      findUsers,
      formatMentionHTML: formatUserMention,
    });
  };

  return (
    <>
      <div className="relative">
        <div
          className="p-3 rounded-md border border-zinc-200"
          ref={editorRef}
        ></div>
      </div>
    </>
  );
}
