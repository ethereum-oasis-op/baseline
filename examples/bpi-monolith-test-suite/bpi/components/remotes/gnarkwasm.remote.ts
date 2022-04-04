import { internalAxios } from './internal.axios';
import { privateInput } from './privateInput';

export const checkValidity = async (input: privateInput) => {
    const response = await internalAxios.post('/', input)
    return response;
}