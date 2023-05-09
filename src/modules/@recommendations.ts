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
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const topAllManga = async () => {
}

const topWebtoons = async () => {
}

const mostPopularManga = async () => {

}