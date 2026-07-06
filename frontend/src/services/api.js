const BASE_URL = "http://127.0.0.1:8000/api";


const request = async (path, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/${path}${query ? `?${query}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const getReadings = async (filters = {}) => request(`readings/`, filters);
export const getSummary = async (filters = {}) => request(`readings/summary/`, filters);
export const getAssets = async () => request(`assets/`);

// export const getReadings = async (filters = {}) => {
//     try {   
//         const response = await fetch(`${BASE_URL}/readings/`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(filters),
//         });
//         return response.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(`Request failed: ${response.status} ${response.statusText}`);
//     }
// };

// export const getSummary = async (filters = {}) => {
//     try {
//         const response = await fetch('/api/readings/summary/');
//         return response.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(`Request failed: ${response.status} ${response.statusText}`);
//     }
// };

// export const getAssets = async () => { 
//     try {
//         const response = await fetch('/api/assets/');
//         return response.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(`Request failed: ${response.status} ${response.statusText}`);
//     }
// };