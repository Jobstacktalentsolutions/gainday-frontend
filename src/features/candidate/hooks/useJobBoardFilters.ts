import { useMemo, useState } from "react";
import { MOCK_JOBS } from "../mocks/mockJobs"
import {
  DEFAULT_JOB_BOARD_FILTERS,
  SALARY_BUCKETS,
  type FilterOption,
  type JobBoardFilters,
  type JobBoardListing,
} from "../types/jobBoard"

