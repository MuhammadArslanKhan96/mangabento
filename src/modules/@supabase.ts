
import { createClient } from '@supabase/supabase-js'
import { topAllManga, topWebtoons, mostPopularManga } from './'

// Supabase Docs: https://supabase.com/docs/reference/javascript/select

const supabase = createClient(`${process.env.SUPABASE_URL}`, `${process.env.SUPABASE_ANON}`)

const initCharts = async () => {
    const MangaChart = await topAllManga();
    const WebtoonChart = await topWebtoons();
    const PopularChart = await mostPopularManga()

    const { error } = await supabase.from('charts')
        .insert([
            { name: 'MangaChart', data: MangaChart },
            { name: 'WebtoonChart', data: WebtoonChart },
            { name: 'PopularChart', data: PopularChart }
        ])
    console.log(error)
}

const updateCharts = async () => {
    const MangaChart = await topAllManga();
    const WebtoonChart = await topWebtoons();
    const PopularChart = await mostPopularManga();

    MangaChart !== null && await supabase.from('charts').update({ data: MangaChart }).eq('name', 'MangaChart');
    WebtoonChart !== null && await supabase.from('charts').update({ data: WebtoonChart }).eq('name', 'WebtoonChart');
    PopularChart !== null && await supabase.from('charts').update({ data: PopularChart }).eq('name', 'PopularChart');

}

export { initCharts }
