"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  ImageIcon,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Pilcrow,
  RemoveFormatting,
  Palette,
  Highlighter,
  Subscript,
  Superscript,
  Table,
  Quote,
} from "lucide-react";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

const TEXT_COLORS = [
  { label: "White", value: "#ffffff" },
  { label: "Light Gray", value: "#d4d4d4" },
  { label: "Gray", value: "#9ca3af" },
  { label: "Green", value: "#00ff88" },
  { label: "Blue", value: "#60a5fa" },
  { label: "Purple", value: "#a78bfa" },
  { label: "Pink", value: "#f472b6" },
  { label: "Red", value: "#f87171" },
  { label: "Orange", value: "#fb923c" },
  { label: "Yellow", value: "#fbbf24" },
  { label: "Teal", value: "#2dd4bf" },
  { label: "Cyan", value: "#22d3ee" },
];

const HIGHLIGHT_COLORS = [
  { label: "None", value: "transparent" },
  { label: "Yellow", value: "rgba(251,191,36,0.25)" },
  { label: "Green", value: "rgba(0,255,136,0.2)" },
  { label: "Blue", value: "rgba(96,165,250,0.2)" },
  { label: "Purple", value: "rgba(167,139,250,0.2)" },
  { label: "Pink", value: "rgba(244,114,182,0.2)" },
  { label: "Red", value: "rgba(248,113,113,0.2)" },
  { label: "Orange", value: "rgba(251,146,60,0.2)" },
];

export default function BlogEditor({
  value,
  onChange,
  onImageUpload,
}: BlogEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [currentBlock, setCurrentBlock] = useState("p");
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const isInitialMount = useRef(true);
  const lastValueRef = useRef(value);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightPickerRef = useRef<HTMLDivElement>(null);

  // Close color pickers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(e.target as Node)) {
        setShowHighlightPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync editor content only when value changes externally
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (editorRef.current && value) {
        editorRef.current.innerHTML = value;
        updateCounts(value);
      }
      return;
    }

    if (editorRef.current && value !== lastValueRef.current) {
      const selection = window.getSelection();
      const hadFocus = document.activeElement === editorRef.current;

      let savedRange: Range | null = null;
      if (hadFocus && selection && selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0).cloneRange();
      }

      editorRef.current.innerHTML = value;
      lastValueRef.current = value;
      updateCounts(value);

      if (hadFocus && savedRange && selection) {
        try {
          selection.removeAllRanges();
          selection.addRange(savedRange);
        } catch {
          // Range may be invalid
        }
      }
    }
  }, [value]);

  const updateCounts = (html: string) => {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    setCharCount(text.length);
    setWordCount(text ? text.split(/\s+/).length : 0);
  };

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("strikeThrough")) formats.add("strikeThrough");
      if (document.queryCommandState("insertUnorderedList")) formats.add("ul");
      if (document.queryCommandState("insertOrderedList")) formats.add("ol");
      if (document.queryCommandState("justifyLeft")) formats.add("justifyLeft");
      if (document.queryCommandState("justifyCenter")) formats.add("justifyCenter");
      if (document.queryCommandState("justifyRight")) formats.add("justifyRight");
      if (document.queryCommandState("justifyFull")) formats.add("justifyFull");
      if (document.queryCommandState("subscript")) formats.add("subscript");
      if (document.queryCommandState("superscript")) formats.add("superscript");

      const color = document.queryCommandValue("foreColor");
      if (color) {
        // Convert rgb to hex
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          const hex = "#" + [match[1], match[2], match[3]].map((x) => parseInt(x).toString(16).padStart(2, "0")).join("");
          setCurrentColor(hex);
        } else if (color.startsWith("#")) {
          setCurrentColor(color);
        }
      }
    } catch {
      // queryCommandState can throw in some edge cases
    }
    setActiveFormats(formats);

    try {
      const block = document.queryCommandValue("formatBlock");
      setCurrentBlock(block || "p");
    } catch {
      setCurrentBlock("p");
    }
  }, []);

  const emitChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastValueRef.current = html;
      onChange(html);
      updateCounts(html);
    }
  }, [onChange]);

  const execCommand = useCallback(
    (command: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, val);
      emitChange();
      updateActiveFormats();
    },
    [emitChange, updateActiveFormats]
  );

  const handleInput = () => {
    emitChange();
    updateActiveFormats();
  };

  const handleSelectionChange = useCallback(() => {
    if (editorRef.current && editorRef.current.contains(document.activeElement)) {
      updateActiveFormats();
    }
  }, [updateActiveFormats]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          execCommand("bold");
          break;
        case "i":
          e.preventDefault();
          execCommand("italic");
          break;
        case "u":
          e.preventDefault();
          execCommand("underline");
          break;
        case "z":
          if (e.shiftKey) {
            e.preventDefault();
            execCommand("redo");
          } else {
            e.preventDefault();
            execCommand("undo");
          }
          break;
        case "k":
          e.preventDefault();
          insertLink();
          break;
        case "e":
          e.preventDefault();
          insertInlineCode();
          break;
        case "d":
          e.preventDefault();
          execCommand("strikeThrough");
          break;
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        execCommand("outdent");
      } else {
        execCommand("indent");
      }
    }

    // Enter inside a code block should just add a newline
    if (e.key === "Enter" && !e.shiftKey) {
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        let node: Node | null = sel.anchorNode;
        while (node && node !== editorRef.current) {
          if (node instanceof HTMLElement && node.tagName === "PRE") {
            e.preventDefault();
            document.execCommand("insertHTML", false, "\n");
            emitChange();
            return;
          }
          node = node.parentNode;
        }
      }
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await insertImage(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const insertImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await onImageUpload(file);
      editorRef.current?.focus();
      document.execCommand(
        "insertHTML",
        false,
        `<figure style="margin:20px 0;text-align:center;"><img src="${url}" alt="blog image" style="max-width:100%;height:auto;border-radius:8px;" /><figcaption contenteditable="true" style="font-size:0.875rem;color:rgba(255,255,255,0.4);margin-top:8px;font-style:italic;">Image caption</figcaption></figure><p><br></p>`
      );
      emitChange();
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    for (const file of files) {
      await insertImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const insertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "";
    const url = prompt("Enter URL:", "https://");
    if (url && url !== "https://") {
      if (selectedText) {
        execCommand("createLink", url);
        // Make sure newly created links open in new tab
        if (editorRef.current) {
          const links = editorRef.current.querySelectorAll('a[href="' + url + '"]');
          links.forEach((link) => {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
          });
          emitChange();
        }
      } else {
        const linkText = prompt("Enter link text:", "Link text") || "Link";
        document.execCommand(
          "insertHTML",
          false,
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
        );
        emitChange();
      }
    }
  };

  const insertInlineCode = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "code";
    document.execCommand(
      "insertHTML",
      false,
      `<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em;">${selectedText}</code>`
    );
    emitChange();
  };

  const insertCodeBlock = () => {
    editorRef.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<pre style="background:#0d0d0d;padding:20px;border-radius:8px;overflow-x:auto;font-family:'Fira Code',monospace;font-size:0.9rem;line-height:1.7;margin:16px 0;border:1px solid rgba(255,255,255,0.08);color:#e2e8f0;"><code>// Your code here</code></pre><p><br></p>`
    );
    emitChange();
  };

  const insertTable = () => {
    editorRef.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr><th style="background:rgba(255,255,255,0.05);padding:10px 14px;text-align:left;border:1px solid rgba(255,255,255,0.1);font-weight:600;">Header 1</th><th style="background:rgba(255,255,255,0.05);padding:10px 14px;text-align:left;border:1px solid rgba(255,255,255,0.1);font-weight:600;">Header 2</th><th style="background:rgba(255,255,255,0.05);padding:10px 14px;text-align:left;border:1px solid rgba(255,255,255,0.1);font-weight:600;">Header 3</th></tr></thead><tbody><tr><td style="padding:10px 14px;border:1px solid rgba(255,255,255,0.1);">Cell 1</td><td style="padding:10px 14px;border:1px solid rgba(255,255,255,0.1);">Cell 2</td><td style="padding:10px 14px;border:1px solid rgba(255,255,255,0.1);">Cell 3</td></tr><tr><td style="padding:10px 14px;border:1px solid rgba(255,255,255,0.1);">Cell 4</td><td style="padding:10px 14px;border:1px solid rgba(255,255,255,0.1);">Cell 5</td><td style="padding:10px 14px;border:1px solid rgba(255,255,255,0.1);">Cell 6</td></tr></tbody></table><p><br></p>`
    );
    emitChange();
  };

  const insertBlockquote = () => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "Quote text here...";
    document.execCommand(
      "insertHTML",
      false,
      `<blockquote style="border-left:4px solid rgba(0,255,136,0.5);padding:12px 20px;margin:16px 0;background:rgba(255,255,255,0.02);border-radius:0 8px 8px 0;font-style:italic;color:rgba(255,255,255,0.6);">${selectedText}</blockquote><p><br></p>`
    );
    emitChange();
  };

  const setTextColor = (color: string) => {
    execCommand("foreColor", color);
    setCurrentColor(color);
    setShowColorPicker(false);
  };

  const setHighlightColor = (color: string) => {
    if (color === "transparent") {
      execCommand("removeFormat");
    } else {
      execCommand("hiliteColor", color);
    }
    setShowHighlightPicker(false);
  };

  const clearFormatting = () => {
    execCommand("removeFormat");
    execCommand("formatBlock", "p");
  };

  const setFontSize = (size: string) => {
    editorRef.current?.focus();
    document.execCommand("fontSize", false, size);
    emitChange();
  };

  const ToolbarButton = ({
    onClick,
    children,
    title,
    disabled,
    active,
    shortcut,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
    active?: boolean;
    shortcut?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${title} (${shortcut})` : title}
      className={`p-1.5 rounded transition-all duration-150 ${
        active
          ? "bg-[#00ff88]/20 text-[#00ff88] shadow-[0_0_6px_rgba(0,255,136,0.15)]"
          : "text-white/50 hover:text-white hover:bg-white/10"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => <div className="w-px h-6 bg-white/8 mx-1.5" />;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-[#1a1a1a] flex flex-col max-h-[85vh]">
      {/* Toolbar - Sticky */}
      <div className="sticky top-0 z-30 bg-[#1a1a1a] flex-shrink-0">
      {/* Toolbar Row 1 - Format & Style */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-white/10 bg-white/[0.02]">
        <ToolbarButton onClick={() => execCommand("undo")} title="Undo" shortcut="Ctrl+Z">
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("redo")} title="Redo" shortcut="Ctrl+Shift+Z">
          <Redo size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block format */}
        <select
          value={currentBlock}
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white/70 focus:outline-none focus:border-[#00ff88]/40 cursor-pointer"
          title="Block Format"
        >
          <option value="p" className="bg-[#1a1a1a]">Paragraph</option>
          <option value="h1" className="bg-[#1a1a1a]">Heading 1</option>
          <option value="h2" className="bg-[#1a1a1a]">Heading 2</option>
          <option value="h3" className="bg-[#1a1a1a]">Heading 3</option>
          <option value="h4" className="bg-[#1a1a1a]">Heading 4</option>
        </select>

        <ToolbarDivider />

        {/* Font size */}
        <select
          onChange={(e) => setFontSize(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white/70 focus:outline-none focus:border-[#00ff88]/40 cursor-pointer"
          title="Font Size"
          defaultValue="3"
        >
          <option value="1" className="bg-[#1a1a1a]">XS</option>
          <option value="2" className="bg-[#1a1a1a]">Small</option>
          <option value="3" className="bg-[#1a1a1a]">Normal</option>
          <option value="4" className="bg-[#1a1a1a]">Medium</option>
          <option value="5" className="bg-[#1a1a1a]">Large</option>
          <option value="6" className="bg-[#1a1a1a]">XL</option>
          <option value="7" className="bg-[#1a1a1a]">XXL</option>
        </select>

        <ToolbarDivider />

        <ToolbarButton onClick={() => execCommand("bold")} title="Bold" shortcut="Ctrl+B" active={activeFormats.has("bold")}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("italic")} title="Italic" shortcut="Ctrl+I" active={activeFormats.has("italic")}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("underline")} title="Underline" shortcut="Ctrl+U" active={activeFormats.has("underline")}>
          <Underline size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("strikeThrough")} title="Strikethrough" shortcut="Ctrl+D" active={activeFormats.has("strikeThrough")}>
          <Strikethrough size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Color Picker */}
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
            }}
            title="Text Color"
            className="p-1.5 rounded transition-all duration-150 text-white/50 hover:text-white hover:bg-white/10 flex items-center gap-0.5"
          >
            <Palette size={15} />
            <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: currentColor }} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 p-2 bg-[#252525] border border-white/15 rounded-lg shadow-xl min-w-[180px]">
              <p className="text-[10px] text-white/40 mb-1.5 px-0.5">Text Color</p>
              <div className="grid grid-cols-6 gap-1">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setTextColor(c.value)}
                    title={c.label}
                    className={`w-6 h-6 rounded border transition-all ${
                      currentColor === c.value
                        ? "border-[#00ff88] scale-110"
                        : "border-white/10 hover:border-white/30 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
                <label className="text-[10px] text-white/40">Custom:</label>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[10px] text-white/40 font-mono">{currentColor}</span>
              </div>
            </div>
          )}
        </div>

        {/* Highlight Color Picker */}
        <div className="relative" ref={highlightPickerRef}>
          <button
            type="button"
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
            }}
            title="Highlight Color"
            className="p-1.5 rounded transition-all duration-150 text-white/50 hover:text-white hover:bg-white/10"
          >
            <Highlighter size={15} />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 p-2 bg-[#252525] border border-white/15 rounded-lg shadow-xl min-w-[180px]">
              <p className="text-[10px] text-white/40 mb-1.5 px-0.5">Highlight</p>
              <div className="grid grid-cols-4 gap-1">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setHighlightColor(c.value)}
                    title={c.label}
                    className="w-8 h-6 rounded border border-white/10 hover:border-white/30 transition-all hover:scale-105 flex items-center justify-center"
                    style={{ backgroundColor: c.value === "transparent" ? "transparent" : c.value }}
                  >
                    {c.value === "transparent" && (
                      <span className="text-[9px] text-white/40">✕</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <ToolbarDivider />

        <ToolbarButton onClick={() => execCommand("justifyLeft")} title="Align Left" active={activeFormats.has("justifyLeft")}>
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("justifyCenter")} title="Align Center" active={activeFormats.has("justifyCenter")}>
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("justifyRight")} title="Align Right" active={activeFormats.has("justifyRight")}>
          <AlignRight size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("justifyFull")} title="Justify" active={activeFormats.has("justifyFull")}>
          <AlignJustify size={15} />
        </ToolbarButton>
      </div>

      {/* Toolbar Row 2 - Insert & Lists */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-1.5 border-b border-white/8 bg-white/[0.01]">
        <ToolbarButton onClick={() => execCommand("insertUnorderedList")} title="Bullet List" active={activeFormats.has("ul")}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("insertOrderedList")} title="Numbered List" active={activeFormats.has("ol")}>
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={insertBlockquote} title="Blockquote">
          <Quote size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={insertInlineCode} title="Inline Code" shortcut="Ctrl+E">
          <Code size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={insertCodeBlock} title="Code Block">
          <span className="text-[10px] font-mono leading-none">{`</>`}</span>
        </ToolbarButton>
        <ToolbarButton onClick={insertLink} title="Insert Link" shortcut="Ctrl+K">
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("insertHorizontalRule")} title="Horizontal Rule">
          <Minus size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={insertTable} title="Insert Table">
          <Table size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => execCommand("subscript")} title="Subscript" active={activeFormats.has("subscript")}>
          <Subscript size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("superscript")} title="Superscript" active={activeFormats.has("superscript")}>
          <Superscript size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={handleImageUpload} title="Upload Image" disabled={uploading}>
          <ImageIcon size={15} />
        </ToolbarButton>
        {uploading && (
          <span className="text-xs text-[#00ff88] ml-1 animate-pulse">Uploading...</span>
        )}

        <ToolbarDivider />

        <ToolbarButton onClick={clearFormatting} title="Clear All Formatting">
          <RemoveFormatting size={15} />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-3 text-white/25 text-[10px]">
          <span>Ctrl+B Bold</span>
          <span>Ctrl+I Italic</span>
          <span>Ctrl+K Link</span>
          <span>Ctrl+E Code</span>
        </div>
      </div>
      </div>{/* End sticky toolbar */}

      {/* Scrollable editor area */}
      <div className="flex-1 overflow-y-auto">
      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => updateActiveFormats()}
        onPaste={(e) => {
          const items = Array.from(e.clipboardData.items);
          const imageItem = items.find((item) => item.type.startsWith("image/"));
          if (imageItem) {
            e.preventDefault();
            const file = imageItem.getAsFile();
            if (file) insertImage(file);
            return;
          }

          const html = e.clipboardData.getData("text/html");
          if (html) {
            e.preventDefault();
            const clean = html
              .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
              .replace(/on\w+="[^"]*"/gi, "");
            document.execCommand("insertHTML", false, clean);
            emitChange();
            return;
          }

          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
          emitChange();
        }}
        className="min-h-[500px] p-6 text-white/90 focus:outline-none leading-relaxed
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-white [&_h1]:leading-tight
          [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-white [&_h2]:leading-tight
          [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-white [&_h3]:leading-tight
          [&_h4]:text-lg [&_h4]:font-medium [&_h4]:mb-2 [&_h4]:mt-3 [&_h4]:text-white/90
          [&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-white/80
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#00ff88]/50 [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-white/60 [&_blockquote]:my-5 [&_blockquote]:bg-white/[0.02] [&_blockquote]:rounded-r-lg
          [&_pre]:bg-[#0d0d0d] [&_pre]:p-5 [&_pre]:rounded-lg [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-white/8 [&_pre]:text-[#e2e8f0]
          [&_code]:font-mono [&_code]:text-[#00ff88] [&_code]:text-[0.9em]
          [&_a]:text-[#00ff88] [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-[#00ff88]/40 hover:[&_a]:decoration-[#00ff88]
          [&_ul]:list-disc [&_ul]:pl-7 [&_ul]:my-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-7 [&_ol]:my-3 [&_ol]:space-y-1
          [&_li]:mb-1.5 [&_li]:text-white/80 [&_li]:leading-relaxed
          [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-2 [&_img]:shadow-lg
          [&_figure]:my-5 [&_figure]:text-center
          [&_figcaption]:text-sm [&_figcaption]:text-white/40 [&_figcaption]:italic [&_figcaption]:mt-2
          [&_hr]:border-white/10 [&_hr]:my-8
          [&_strong]:text-white [&_strong]:font-semibold
          [&_em]:italic
          [&_s]:line-through [&_s]:text-white/40
          [&_sub]:text-[0.75em] [&_sup]:text-[0.75em]
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
          [&_th]:bg-white/5 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:border [&_th]:border-white/10 [&_th]:font-semibold
          [&_td]:px-4 [&_td]:py-2 [&_td]:border [&_td]:border-white/10
          [&_tr:hover]:bg-white/[0.02]
        "
        style={{ minHeight: "500px" }}
      />
      </div>{/* End scrollable area */}

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/8 bg-white/[0.01] text-[10px] text-white/30">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Pilcrow size={10} />
            {currentBlock.toUpperCase() || "P"}
          </span>
          {activeFormats.size > 0 && (
            <span className="flex items-center gap-1">
              <Type size={10} />
              {Array.from(activeFormats).join(", ")}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Palette size={10} />
            <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: currentColor }} />
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
          <span>Drop / paste images</span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
