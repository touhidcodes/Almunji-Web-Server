import httpStatus from "http-status";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { dashboardServices } from "./dashboard.service";

// Get Dashboard Stats
const getDashboardStats = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const stats = await dashboardServices.getDashboardStats(role, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard stats retrieved successfully!",
    data: stats,
  });
});

export const dashboardControllers = {
  getDashboardStats,
};
