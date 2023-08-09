import { searchDB, searchDBPagination } from "@/modules";
import { NextResponse } from "next/server";

export async function GET(req: { url: string }) {
    const { searchParams } = new URL(req.url);
    const from = Number(searchParams.get("from"));
    const to = Number(searchParams.get("to"));
    const providers = await searchDB("providers");
    const webtoons =
        from && to ? await searchDBPagination("webtoon_books", [from, to]) : await searchDB("webtoon_books");
    const chapters = await searchDB("webtoon_chapters");
    let newwebtoons = webtoons?.map((i) => ({
        ...i,
        provider: providers?.filter((item) => item.slug === i.provider)[0],
        chapters: chapters?.filter((item) => item.provider_webtoons.split("_")[1] === i.slug),
    }));
    return NextResponse.json(newwebtoons);
}
