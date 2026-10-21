export type TCreatedWord = {
  id: string;
  persianWord: string;
  banglaMeaning: string;
  transliteration: string | null;
};

export type TCreatedAyah = {
  id: string;
  surahId: string;
  paraId: string;
  number: number;
  arabic: string;
  transliteration: string | null;
  bangla: string | null;
  english: string | null;
};

export type TCreatedTafsir = {
  ayahId: string;
};

export type TCreatedAyahWithTafsir = {
  createdAyahs: TCreatedAyah[];
  existingAyahs: string[];
  createdTafsirs: TCreatedTafsir[];
  existingTafsirs: string[];
};
