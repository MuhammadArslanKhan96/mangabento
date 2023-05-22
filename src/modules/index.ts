/*
The index.ts file is responsible for exporting the functions from the @recommendations.ts and @supabase.ts files.
 */
export { initCharts, insertDB, uploadFile, searchDB } from './@supabase';
export { searchData, topAllManga, topWebtoons, mostPopularManga } from './@recommendations';

export { getProviders, getLatest, getAllWebtoons, getAllChapters } from './@webtoons';