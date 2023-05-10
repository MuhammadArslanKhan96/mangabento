import axios from 'axios';
import { FetchParams, Search } from './types';


async function fetch({ endpoint, method = "GET" }: FetchParams) {
    const params = {
        method: method,
        url: `https://${process.env.RECOMMENDATIONS_API}/${endpoint}`,
        headers: {
            'X-RapidAPI-Key': process.env.RECOMMENDATIONS_API_KEY,
            'X-RapidAPI-Host': process.env.RECOMMENDATIONS_API
        }
    };

    return axios(params)
        .then(response => response.data)
        .catch(error => console.log(error));
}


const searchData = async ({ q }: Search) => {
    const url = `manga/search/${q}`;
    try {
        const response = await fetch({ endpoint: url });
        if (!response.data) {
            throw new Error('No data found');
        }
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const topAllManga = async () => {
    const url = `manga/top/all`;
    try {
        const response = await fetch({ endpoint: url });
        if (!response) {
            throw new Error('No data found');
        }
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const topWebtoons = async () => {
    const url = `manga/top/manhua`;
    const url2 = `manga/top/manhwa`;
    const { data: { data: manhwaData } } = await fetch({ endpoint: url })
    const { data: { data: manhuaData } } = await fetch({ endpoint: url2 })
    const data = [...manhwaData, ...manhuaData]
    return data
}

const mostPopularManga = async () => {
    const url = `manga/top/bypopularity`;
    try {
        const response = await fetch({ endpoint: url });
        if (!response.data) {
            throw new Error('No data found');
        }
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }

}

export { searchData, topAllManga, topWebtoons, mostPopularManga };