"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $insertNodes,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  type LexicalEditor,
  type EditorState,
  type TextFormatType,
  type ElementFormatType,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingNode,
  QuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { $isLinkNode, AutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $setBlocksType, $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List as ListIcon,
  ListOrdered,
  Code,
  ImageIcon,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Quote as QuoteIcon,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  ChevronDown,
  Baseline,
  Highlighter,
  Plus,
} from "lucide-react";

/* ──────────────────── Types ──────────────────── */

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

/* ──────────────────── Theme ──────────────────── */

const editorTheme = {
  paragraph: "mb-2 leading-relaxed text-white/80",
  text: {
    bold: "font-bold text-white",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "font-mono bg-white/[0.08] text-[#00ff88] text-[0.9em] px-1.5 py-0.5 rounded",
  },
  heading: {
    h1: "text-3xl font-bold mb-4 mt-6 text-white leading-tight",
    h2: "text-2xl font-semibold mb-3 mt-5 text-white leading-tight",
    h3: "text-xl font-medium mb-2 mt-4 text-white leading-tight",
  },
  list: {
    ul: "list-disc pl-7 my-3 space-y-1 text-white/80",
    ol: "list-decimal pl-7 my-3 space-y-1 text-white/80",
    listitem: "mb-1 leading-relaxed",
    nested: { listitem: "list-none" },
  },
  quote:
    "border-l-4 border-[#00ff88]/50 pl-5 py-3 my-4 bg-white/[0.02] rounded-r-lg italic text-white/60",
  code: "bg-[#0d0d0d] block p-5 rounded-lg my-4 overflow-x-auto border border-white/[0.08] text-[#e2e8f0] font-mono text-sm leading-relaxed",
  codeHighlight: {},
  link: "text-[#00ff88] underline underline-offset-2 decoration-[#00ff88]/40 cursor-pointer",
};

/* ──────────────────── Config ──────────────────── */

const editorConfig = {
  namespace: "BlogEditor",
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    LinkNode,
    AutoLinkNode,
  ],
  onError: (error: Error) => console.error("Lexical Error:", error),
};

/* ──────────────────── Block labels ──────────────────── */

const BLOCK_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  paragraph: { label: "Normal", icon: <Pilcrow size={14} /> },
  h1: { label: "Heading 1", icon: <Heading1 size={14} /> },
  h2: { label: "Heading 2", icon: <Heading2 size={14} /> },
  h3: { label: "Heading 3", icon: <Heading3 size={14} /> },
  bullet: { label: "Bullet List", icon: <ListIcon size={14} /> },
  number: { label: "Numbered List", icon: <ListOrdered size={14} /> },
  quote: { label: "Quote", icon: <QuoteIcon size={14} /> },
  code: { label: "Code Block", icon: <Code size={14} /> },
};

/* ──────────────────── Toolbar Button ──────────────────── */

function TBtn({
  onClick,
  children,
  title,
  active,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-[#00ff88]/20 text-[#00ff88] shadow-[0_0_6px_rgba(0,255,136,0.15)]"
          : "text-white/50 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-6 bg-white/10 mx-1" />;
}

/* ──────────────────── Color Presets ──────────────────── */

const COLOR_PRESETS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
  "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
  "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0",
  "#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79",
  "#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47",
  "#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130",
];

/* ──────────────────── Font Size Control ──────────────────── */

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 16;

function FontSizeControl({
  fontSize,
  editor,
}: {
  fontSize: number;
  editor: LexicalEditor;
}) {
  const applySize = useCallback(
    (size: number) => {
      editor.update(() => {
        const sel = $getSelection();
        if ($isRangeSelection(sel)) {
          $patchStyleText(sel, { "font-size": size + "px" });
        }
      });
    },
    [editor],
  );

  return (
    <div className="flex items-center gap-0">
      <button
        type="button"
        title="Decrease font size"
        onClick={() => applySize(Math.max(MIN_FONT_SIZE, fontSize - 1))}
        className="p-1 rounded-l text-white/50 hover:text-white hover:bg-white/10 transition-colors border border-white/10 border-r-0"
      >
        <Minus size={12} />
      </button>
      <input
        type="text"
        value={fontSize}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n) && n >= MIN_FONT_SIZE && n <= MAX_FONT_SIZE) applySize(n);
        }}
        className="w-8 text-center text-xs bg-white/5 border border-white/10 text-white/70 py-1 outline-none focus:border-[#00ff88]/40"
      />
      <button
        type="button"
        title="Increase font size"
        onClick={() => applySize(Math.min(MAX_FONT_SIZE, fontSize + 1))}
        className="p-1 rounded-r text-white/50 hover:text-white hover:bg-white/10 transition-colors border border-white/10 border-l-0"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

/* ──────────────────── Color Picker Dropdown ──────────────────── */

function ColorPickerDropdown({
  color,
  onApply,
  icon,
  title,
}: {
  color: string;
  onApply: (color: string) => void;
  icon: React.ReactNode;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", cb);
    return () => document.removeEventListener("mousedown", cb);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title={title}
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center p-1 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
      >
        <span className="flex items-center">{icon}</span>
        <span
          className="w-4 h-1 rounded-sm mt-0.5"
          style={{ backgroundColor: color || "#ffffff" }}
        />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 bg-[#222] border border-white/10 rounded-lg shadow-2xl p-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-10 gap-0.5 w-[220px]">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => {
                  onApply(c);
                  setOpen(false);
                }}
                className={`w-5 h-5 rounded-sm border transition-transform hover:scale-125 ${
                  color === c ? "border-[#00ff88] ring-1 ring-[#00ff88]/50" : "border-white/10"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          {/* Custom color input */}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
            <input
              type="color"
              value={color || "#ffffff"}
              onChange={(e) => {
                onApply(e.target.value);
                setOpen(false);
              }}
              className="w-6 h-6 rounded cursor-pointer border border-white/10 bg-transparent"
            />
            <span className="text-[10px] text-white/40">Custom</span>
            {color && (
              <button
                type="button"
                onClick={() => {
                  onApply("");
                  setOpen(false);
                }}
                className="ml-auto text-[10px] text-white/40 hover:text-white/70 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────── Block Dropdown ──────────────────── */

function BlockDropdown({
  blockType,
  editor,
}: {
  blockType: string;
  editor: LexicalEditor;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", cb);
    return () => document.removeEventListener("mousedown", cb);
  }, []);

  const apply = (type: string) => {
    editor.update(() => {
      const sel = $getSelection();
      if (!$isRangeSelection(sel)) return;

      if (type === "paragraph") {
        $setBlocksType(sel, () => $createParagraphNode());
      } else if (type === "h1" || type === "h2" || type === "h3") {
        $setBlocksType(sel, () => $createHeadingNode(type as HeadingTagType));
      } else if (type === "quote") {
        $setBlocksType(sel, () => $createQuoteNode());
      } else if (type === "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else if (type === "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else if (type === "code") {
        $setBlocksType(sel, () => new CodeNode());
      }
    });
    setOpen(false);
  };

  const cur = BLOCK_LABELS[blockType] ?? BLOCK_LABELS.paragraph;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs text-white/70 bg-white/5 border border-white/10 hover:border-white/20 transition-colors min-w-[130px]"
      >
        <span className="flex items-center gap-1.5">
          {cur.icon}
          {cur.label}
        </span>
        <ChevronDown size={12} className="ml-auto opacity-50" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-56 bg-[#222] border border-white/10 rounded-lg shadow-2xl py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {Object.entries(BLOCK_LABELS).map(([key, { label, icon }]) => (
            <button
              key={key}
              type="button"
              onClick={() => apply(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                blockType === key
                  ? "text-[#00ff88] bg-[#00ff88]/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────── Toolbar Plugin ──────────────────── */

function ToolbarPlugin({ onImageUpload }: { onImageUpload: (file: File) => Promise<string> }) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontColor, setFontColor] = useState("");
  const [bgColor, setBgColor] = useState("");

  /* ---- keep toolbar state in sync ---- */
  const $updateToolbar = useCallback(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) return;

    setIsBold(sel.hasFormat("bold"));
    setIsItalic(sel.hasFormat("italic"));
    setIsUnderline(sel.hasFormat("underline"));
    setIsStrikethrough(sel.hasFormat("strikethrough"));
    setIsCode(sel.hasFormat("code"));

    const node = sel.anchor.getNode();
    const parent = node.getParent();
    setIsLink($isLinkNode(parent) || $isLinkNode(node));

    /* font-size / color / background-color */
    const fsVal = $getSelectionStyleValueForProperty(sel, "font-size", `${DEFAULT_FONT_SIZE}px`);
    setFontSize(parseInt(fsVal, 10) || DEFAULT_FONT_SIZE);
    setFontColor($getSelectionStyleValueForProperty(sel, "color", ""));
    setBgColor($getSelectionStyleValueForProperty(sel, "background-color", ""));

    const anchor = sel.anchor.getNode();
    let element =
      anchor.getKey() === "root" ? anchor : anchor.getTopLevelElementOrThrow();
    const dom = editor.getElementByKey(element.getKey());

    if (dom !== null) {
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchor, ListNode);
        setBlockType(parentList ? parentList.getListType() : element.getListType());
      } else {
        const tag = $isHeadingNode(element) ? element.getTag() : element.getType();
        setBlockType(tag in BLOCK_LABELS ? tag : "paragraph");
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read($updateToolbar);
    });
  }, [editor, $updateToolbar]);

  /* ---- actions ---- */
  const insertLink = useCallback(() => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      const url = prompt("Enter URL:", "https://");
      if (url && url !== "https://") {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url, target: "_blank" });
      }
    }
  }, [editor, isLink]);

  const insertImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const url = await onImageUpload(file);
        editor.update(() => {
          const dom = new DOMParser().parseFromString(
            `<p><img src="${url}" alt="blog image" style="max-width:100%;border-radius:8px;" /></p>`,
            "text/html",
          );
          const nodes = $generateNodesFromDOM(editor, dom);
          $insertNodes(nodes);
        });
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Failed to upload image");
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const insertHR = useCallback(() => {
    editor.update(() => {
      const dom = new DOMParser().parseFromString("<hr/>", "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $insertNodes(nodes);
    });
  }, [editor]);

  const applyFontColor = useCallback(
    (color: string) => {
      editor.update(() => {
        const sel = $getSelection();
        if ($isRangeSelection(sel)) {
          $patchStyleText(sel, { color: color || null });
        }
      });
    },
    [editor],
  );

  const applyBgColor = useCallback(
    (color: string) => {
      editor.update(() => {
        const sel = $getSelection();
        if ($isRangeSelection(sel)) {
          $patchStyleText(sel, { "background-color": color || null });
        }
      });
    },
    [editor],
  );

  /* ---- render ---- */
  return (
    <div className="sticky top-0 z-30 bg-[#1a1a1a] shrink-0 border-b border-white/10">
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2">
        {/* Undo / Redo */}
        <TBtn onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} title="Undo (Ctrl+Z)">
          <Undo size={16} />
        </TBtn>
        <TBtn onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} title="Redo (Ctrl+Y)">
          <Redo size={16} />
        </TBtn>

        <Sep />

        {/* Block type */}
        <BlockDropdown blockType={blockType} editor={editor} />

        <Sep />

        {/* Inline format */}
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold" as TextFormatType)}
          title="Bold (Ctrl+B)"
          active={isBold}
        >
          <Bold size={16} />
        </TBtn>
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic" as TextFormatType)}
          title="Italic (Ctrl+I)"
          active={isItalic}
        >
          <Italic size={16} />
        </TBtn>
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline" as TextFormatType)}
          title="Underline (Ctrl+U)"
          active={isUnderline}
        >
          <Underline size={16} />
        </TBtn>
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough" as TextFormatType)}
          title="Strikethrough"
          active={isStrikethrough}
        >
          <Strikethrough size={16} />
        </TBtn>
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code" as TextFormatType)}
          title="Inline Code"
          active={isCode}
        >
          <Code size={16} />
        </TBtn>

        <Sep />

        {/* Font size */}
        <FontSizeControl fontSize={fontSize} editor={editor} />

        <Sep />

        {/* Text color */}
        <ColorPickerDropdown
          color={fontColor}
          onApply={applyFontColor}
          icon={<Baseline size={16} />}
          title="Text Color"
        />

        {/* Highlight color */}
        <ColorPickerDropdown
          color={bgColor}
          onApply={applyBgColor}
          icon={<Highlighter size={16} />}
          title="Highlight Color"
        />

        <Sep />

        {/* Alignment */}
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left" as ElementFormatType)}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </TBtn>
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center" as ElementFormatType)}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </TBtn>
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right" as ElementFormatType)}
          title="Align Right"
        >
          <AlignRight size={16} />
        </TBtn>
        <TBtn
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify" as ElementFormatType)}
          title="Justify"
        >
          <AlignJustify size={16} />
        </TBtn>

        <Sep />

        {/* Lists */}
        <TBtn
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          title="Bullet List"
          active={blockType === "bullet"}
        >
          <ListIcon size={16} />
        </TBtn>
        <TBtn
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          title="Numbered List"
          active={blockType === "number"}
        >
          <ListOrdered size={16} />
        </TBtn>

        <Sep />

        {/* Link */}
        <TBtn onClick={insertLink} title="Insert Link (Ctrl+K)" active={isLink}>
          <LinkIcon size={16} />
        </TBtn>

        {/* Image */}
        <TBtn onClick={insertImage} title="Upload Image">
          <ImageIcon size={16} />
        </TBtn>

        {/* HR */}
        <TBtn onClick={insertHR} title="Horizontal Rule">
          <Minus size={16} />
        </TBtn>
      </div>
    </div>
  );
}

/* ──────────────────── Initial Content Plugin ──────────────────── */

function InitPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !html) return;
    loaded.current = true;

    editor.update(() => {
      const dom = new DOMParser().parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      if (nodes.length > 0) root.append(...nodes);
    });
  }, [editor, html]);

  return null;
}

/* ──────────────────── Main Component ──────────────────── */

export default function BlogEditor({ value, onChange, onImageUpload }: BlogEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleChange = useCallback(
    (_state: EditorState, editor: LexicalEditor) => {
      editor.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        setCharCount(text.length);
        setWordCount(text ? text.split(/\s+/).length : 0);
        onChange(html);
      });
    },
    [onChange],
  );

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-[#1a1a1a] flex flex-col max-h-[85vh]">
      <LexicalComposer initialConfig={editorConfig}>
        {/* Toolbar */}
        <ToolbarPlugin onImageUpload={onImageUpload} />

        {/* Editor */}
        <div className="relative flex-1 overflow-y-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[500px] p-6 text-white/90 focus:outline-none leading-relaxed"
                style={{ minHeight: 500 }}
              />
            }
            placeholder={
              <div className="absolute top-6 left-6 text-white/30 pointer-events-none select-none">
                Start writing your blog post...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        {/* Plugins */}
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <InitPlugin html={value} />

        {/* Status bar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/10 bg-white/[0.02] text-[10px] text-white/30">
          <span className="flex items-center gap-1">
            <Pilcrow size={10} />
            Lexical Rich-Text
          </span>
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
