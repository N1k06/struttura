const API_BASE_URL = '';

export async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await response.json();
}