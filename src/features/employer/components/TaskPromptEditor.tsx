import { useEffect, type ReactNode } from "react";
import { useEditor, EditorContent, markdown } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { Bold, Italic, Link as LinkIcon, List } from "lucide-react";
import { cn } from "@/lib/utils";


