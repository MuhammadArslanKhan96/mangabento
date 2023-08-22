/*
The @supabase.ts file is responsible for fetching data from the Supabase API. It contains the following functions:

initCharts: Inserts data into the charts table.
updateCharts: Updates data in the charts table.
searchManga: Fetches data from the Supabase API based on the search query.
searchWebtoon: Fetches data from the Supabase API based on the search query.

*/
import { createClient } from "@supabase/supabase-js";
import { topAllManga, topWebtoons, mostPopularManga } from "./";
import { InsertDB } from "./types";

// Supabase Docs: https://supabase.com/docs/reference/javascript/select

const supabase = createClient(
    `${process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL}`,
    `${process.env.SUPABASE_ANON || process.env.NEXT_PUBLIC_SUPABASE_ANON}`,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    }
);


async function userLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: `${process.env.SUPABASE_USER}`,
        password: `${process.env.SUPABASE_PASS}`,
    });
    // console.log(data, error)
}

const initCharts = async () => {
    const MangaChart = await topAllManga();
    const WebtoonChart = await topWebtoons();
    const PopularChart = await mostPopularManga();

    const { error } = await supabase.from("charts").insert([
        { name: "MangaChart", data: MangaChart },
        { name: "WebtoonChart", data: WebtoonChart },
        { name: "PopularChart", data: PopularChart },
    ]);
    console.log(error);
};

const updateCharts = async () => {
    const MangaChart = await topAllManga();
    const WebtoonChart = await topWebtoons();
    const PopularChart = await mostPopularManga();

    MangaChart !== null && (await supabase.from("charts").update({ data: MangaChart }).eq("name", "MangaChart"));
    WebtoonChart !== null && (await supabase.from("charts").update({ data: WebtoonChart }).eq("name", "WebtoonChart"));
    PopularChart !== null && (await supabase.from("charts").update({ data: PopularChart }).eq("name", "PopularChart"));
};

const searchDB = async (table: string) => {
    const { data, error } = await supabase.from(table).select();
    return data;
};

const searchDBById = async (table: string, id: number) => {
    const { data, error } = await supabase.from(table).select();
    const filteredData = data?.filter((i) => i.id === id)[0];
    return filteredData;
};

const searchDBPagination = async (table: string, range: [number, number]) => {
    const { data, error } = await supabase.from(table).select().range(range[0], range[1]);
    return data;
};

const searchDBPaginationWithKeyword = async (table: string, range: [number, number], keywords: string) => {
    const { data, error } = await supabase.from(table).select().range(range[0], range[1]);
    return data?.filter((i) => (keywords ? keywords.split(",")?.some((item) => i.genre.includes(item)) : true));
};

const uploadFile = async (bucket: string, name: string, imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileExtension = imageUrl.split(".").slice(-1)[0].toLowerCase();
    console.log("repsonse", blob);
    const { error } = await supabase.storage.from(bucket).upload(`public/${name}.${fileExtension}`, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: "" + blob.type + "",
    });

    const { data } = supabase.storage.from(bucket).getPublicUrl(`public/${name}.${fileExtension}`);
    return data;
};

const insertDB = async ({ table, data }: InsertDB) => {
    const { error } = await supabase.from(`${table}`).insert(data);
    const response = error ? `Error: cannot add item to ${table}` : `Success adding item to ${table}`;
    console.log(response, error);
    return response;
};

export {
    initCharts,
    updateCharts,
    insertDB,
    uploadFile,
    searchDB,
    searchDBPagination,
    searchDBById,
    searchDBPaginationWithKeyword,
    supabase
};
