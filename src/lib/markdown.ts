import type { Options as ReactMarkdownOptions } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Markdown parsing shared by every renderer. Single tildes are plain text: "~220 employees" must not
 * turn into strikethrough. Double tildes (~~text~~) still strike through.
 */
export const MARKDOWN_PLUGINS: NonNullable<ReactMarkdownOptions["remarkPlugins"]> = [[remarkGfm, { singleTilde: false }]];
