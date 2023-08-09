import { searchDB, searchDBById } from "@/modules";
import { NextResponse } from "next/server";

export async function GET(req: any, { params: { id, chapterid } }: { params: { id: string; chapterid: string } }) {
    const webtoon = await searchDBById("webtoon_books", Number(id));
    const chapters = await searchDB("webtoon_chapters");
    const chapter = chapters?.filter(
        (item) => item.provider_webtoons.split("_")[1] === webtoon?.slug && item.id === Number(chapterid)
    )[0];
    return NextResponse.json(chapter);
}
