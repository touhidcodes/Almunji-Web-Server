import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { dictionaryServices } from "./dictionary.service";
import {
  wordFilterableFields,
  wordPaginationFields,
  wordSuggestionFilterableFields,
} from "./dictionary.constants";
import queryFilters from "../../utils/queryFilters";

// Controller to create a new dictionary word
const createWord = catchAsync(async (req, res) => {
  const result = await dictionaryServices.createWord(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Word created successfully!",
    data: result,
  });
});

// Controller to get dictionary words
const getSuggestion = catchAsync(async (req, res) => {
  const options = queryFilters(
    req.query,
    wordSuggestionFilterableFields,
    wordPaginationFields
  );

  const result = await dictionaryServices.getSuggestion(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Words retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Controller to get all dictionary words
const getAllWordsByAdmin = catchAsync(async (req, res) => {
  const options = queryFilters(
    req.query,
    wordFilterableFields,
    wordPaginationFields
  );

  const result = await dictionaryServices.getAllWordsByAdmin(options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All words retrieved successfully!",
    data: result,
  });
});

// Controller to get a specific word by ID
const getWordById = catchAsync(async (req, res) => {
  const { wordId } = req.params;
  const result = await dictionaryServices.getWordById(wordId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Word retrieved successfully!",
    data: result,
  });
});

// Controller to update a dictionary word by ID
const updateWord = catchAsync(async (req, res) => {
  const { wordId } = req.params;
  const result = await dictionaryServices.updateWord(wordId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Word updated successfully!",
    data: result,
  });
});

// Controller to delete a dictionary word by ID
const deleteWord = catchAsync(async (req, res) => {
  const { wordId } = req.params;
  const result = await dictionaryServices.deleteWord(wordId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Word removed successfully!",
    data: result,
  });
});

// Controller to delete a dictionary word by ID only admins
const deleteWordByAdmin = catchAsync(async (req, res) => {
  const { wordId } = req.params;
  const result = await dictionaryServices.deleteWordByAdmin(wordId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Word deleted successfully!",
    data: result,
  });
});

export const dictionaryControllers = {
  createWord,
  getSuggestion,
  getAllWordsByAdmin,
  getWordById,
  updateWord,
  deleteWord,
  deleteWordByAdmin,
};
