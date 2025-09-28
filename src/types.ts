export type ISODate = string;   // "2025-09-28"
export type IsoTimeTz = string; // "08:30:00+00"

export type FeedMethod = 'bottle' | 'breast';
export type FeedUnit = 'ml' | 'oz';
export type FeedSide = 'left' | 'right';

export type DayData = {
  feeds: any[];
  diapers: any[];
  sleeps: any[];
  vitamins: any[];
  weights: any[];
  heights: any[];
  others: any[];
};
