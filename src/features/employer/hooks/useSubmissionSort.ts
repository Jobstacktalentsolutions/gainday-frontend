import { useState } from "react";
import type { SubmissionSort } from "../types/submission";
import { DEFAULT_SORT } from "../utils/submissionSort";

export const useSubmissionSort = () => {
    const [sort, setSort] = useState<SubmissionSort>(DEFAULT_SORT);

    const isDefault = sort.key === DEFAULT_SORT.key && sort.direction === DEFAULT_SORT.direction;
    const reset = () => setSort(DEFAULT_SORT);

    return { sort, setSort, isDefault, reset };
};