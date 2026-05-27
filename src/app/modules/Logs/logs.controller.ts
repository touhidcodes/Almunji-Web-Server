import httpStatus from "http-status";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import queryFilters from "@/utils/queryFilters";
import { logFilterableFields, logPaginationFields } from "./logs.constants";
import { logsServices } from "./logs.service";

// GET /api/v1/logs/files
// List all available log files with size info
const getLogFiles = catchAsync(async (req, res) => {
  const result = logsServices.getLogFileList();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Log files retrieved successfully!",
    data: result,
  });
});

// GET /api/v1/logs
// Get paginated log entries from ALL files with filters
const getLogs = catchAsync(async (req, res) => {
  const { filters, pagination } = queryFilters(
    req.query,
    logFilterableFields,
    logPaginationFields
  );

  const result = logsServices.getLogs(filters as any, pagination as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logs retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/v1/logs/file/:filename
// Get paginated log entries from a specific log file
const getLogsByFile = catchAsync(async (req, res) => {
  const { filename } = req.params;

  const { filters, pagination } = queryFilters(
    req.query,
    logFilterableFields,
    logPaginationFields
  );

  const result = logsServices.getLogsByFile(
    filename,
    filters as any,
    pagination as any
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Logs from "${filename}" retrieved successfully!`,
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/v1/logs/summary
// Get analytics summary (counts by level, category, HTTP stats, DB stats)
const getLogSummary = catchAsync(async (req, res) => {
  const { filters } = queryFilters(
    req.query,
    logFilterableFields,
    logPaginationFields
  );

  const result = logsServices.getLogSummary(filters as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Log summary retrieved successfully!",
    data: result,
  });
});

export const logsControllers = {
  getLogFiles,
  getLogs,
  getLogsByFile,
  getLogSummary,
};
