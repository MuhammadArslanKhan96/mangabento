import axios from 'axios';
import { FetchParams, Providers, WebtoonChapters } from './types';


async function fetch({ endpoint, method = "GET", parameters }: FetchParams) {
    const params = {
        method: method,
        url: `https://${process.env.WEBTOONS_API}/${endpoint}`,
        headers: {
            'X-RapidAPI-Key': process.env.WEBTOONS_API_KEY,
            'X-RapidAPI-Host': process.env.WEBTOONS_API
        }
    };

    parameters && Object.assign(params, { params: parameters })

    return axios(params)
        .then(response => response.data)
        .catch(error => console.log(error));
}

const getProviders = async () => {
    const url = `providers`;
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

const getLatest = async () => {
    const url = `updates`;
    const params = {
        day: '7',
        provider: 'asura', // optional
    }
    try {
        const response = await fetch({ endpoint: url, parameters: params });
        if (!response) {
            throw new Error('No data found');
        }
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getWebtoon = async () => { }

const getChapters = async () => {

    const url = `webtoons/all`;
    const params = {
        provider: name,
    }
    try {
        const response = await fetch({ endpoint: url, parameters: params });
        if (!response) {
            throw new Error('No data found');
        }
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Initially download the data from the API and insert it into the database

const getAllWebtoons = async ({ name }: Providers) => {
    const url = `webtoons/all`;
    const params = {
        provider: name,
    }
    try {
        const response = await fetch({ endpoint: url, parameters: params });
        if (!response) {
            throw new Error('No data found');
        }
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getAllChapters = async ({ name, webtoon }: WebtoonChapters) => {
    const url = `chapters/all`;
    const params = {
        provider: name,
        webtoon: webtoon
    }
    try {
        const response = await fetch({ endpoint: url, parameters: params });
        if (!response) {
            throw new Error('No data found');
        }
        return response;
    } catch (error) {
        //  console.error(error);
        return null;
    }
}

export { getProviders, getLatest, getAllWebtoons, getAllChapters }