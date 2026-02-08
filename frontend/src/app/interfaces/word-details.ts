export interface IWordDetails {
  translation: string;
  examples: { en: string; pt: string; }[];
  definitions: { context: string; meaning: string; }[];
}