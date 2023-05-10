import { NextResponse } from 'next/server';
import { searchData, topAllManga, topWebtoons, mostPopularManga } from '@/modules/'

type ResponseData = {
    message: string;
};



export async function GET() {
    const res = await topAllManga();

    return NextResponse.json({ res });
}