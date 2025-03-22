import { Request, Response } from "express";
import { tafsirServices } from "./tafsir.service";
import httpStatus from "http-status";

// Controller to create a new Tafsir
const createTafsir = async (req: Request, res: Response) => {
  const tafsirData = req.body;
  const newTafsir = await tafsirServices.createTafsir(tafsirData);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Tafsir created successfully",
    data: newTafsir,
  });
};

// Controller to get all Tafsirs of a specific Ayah
const getTafsirsByAyah = async (req: Request, res: Response) => {
  const { ayahId } = req.params;
  const tafsirs = await tafsirServices.getTafsirsByAyah(ayahId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Tafsirs retrieved successfully",
    data: tafsirs,
  });
};

// Controller to get a specific Tafsir by ID
const getTafsirById = async (req: Request, res: Response) => {
  const { tafsirId } = req.params;
  const tafsir = await tafsirServices.getTafsirById(tafsirId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Tafsir retrieved successfully",
    data: tafsir,
  });
};

// Controller to update a Tafsir
const updateTafsir = async (req: Request, res: Response) => {
  const { tafsirId } = req.params;
  const tafsirData = req.body;
  const updatedTafsir = await tafsirServices.updateTafsir(tafsirId, tafsirData);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Tafsir updated successfully",
    data: updatedTafsir,
  });
};

// Controller to delete a Tafsir
const deleteTafsir = async (req: Request, res: Response) => {
  const { tafsirId } = req.params;
  await tafsirServices.deleteTafsir(tafsirId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Tafsir deleted successfully",
  });
};

export const tafsirControllers = {
  createTafsir,
  getTafsirsByAyah,
  getTafsirById,
  updateTafsir,
  deleteTafsir,
};
