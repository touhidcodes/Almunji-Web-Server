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
