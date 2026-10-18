// A submitted written answer, shown where the answer box was. Used by every interface renderer
// in read-only mode, so review pages show the text the same way wherever it was written.
const ReadOnlyAnswerText = ({ value }: { value: string }) =>
    value.trim() ? (
        <p className="w-full whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-[16px] text-neutral-800">
            {value}
        </p>
    ) : (
        <p className="text-sm text-neutral-500">No written answer was submitted.</p>
    );

export default ReadOnlyAnswerText;
