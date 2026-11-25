const DEFAULT_MAX_WORDS = 250;
const AVERAGE_CHARACTERS_PER_WORD = 6;
const APPROX_CHARS_PER_LINE = 80;
const LINE_HEIGHT_PX = 24;
const VERTICAL_PADDING_PX = 24;
const MIN_HEIGHT_PX = 160;

export function answerBoxHeight(maxWords: number | undefined): string {
    const words = maxWords && maxWords > 0 ? maxWords : DEFAULT_MAX_WORDS;
    const estimatedLines = Math.ceil(words * AVERAGE_CHARACTERS_PER_WORD / APPROX_CHARS_PER_LINE);
    const height = Math.max(MIN_HEIGHT_PX, estimatedLines * LINE_HEIGHT_PX + VERTICAL_PADDING_PX);
    return `min(${height}px, 60dvh)`;
}
