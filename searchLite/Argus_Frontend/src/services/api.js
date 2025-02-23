const API_BASE_URL = '/api';

//const API_BASE_URL = 'http://localhost:8100/api';



function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}



const handleResponse = async (response) => {
  console.log(response)
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Default options for all requests
const getDefaultOptions = (options = {}) => {
  const csrfToken = getCookie('csrftoken');
  
  return {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      ...options.headers,
    },
    ...options,
  };
};

export const api = {
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      ...getDefaultOptions({
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    });
    return handleResponse(response);
  },

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      ...getDefaultOptions({
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    });
    return handleResponse(response);
  },

  async uploadFiles(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${API_BASE_URL}/upload/`, {
      credentials: 'include',  
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'), // Added CSRF token header
      },
      body: formData,
    });
    return handleResponse(response);
  },

  async getSearchResults() {
    const response = await fetch(`${API_BASE_URL}/results/`, {
      ...getDefaultOptions({
        method: 'GET',
      }),
    });
    return handleResponse(response);
  },

  async search(query) {  // Added search endpoint
    const queryString = Array.isArray(query) 
      ? query.map(q => `q=${encodeURIComponent(q)}`).join('&')
      : `q=${encodeURIComponent(query)}`;
      
    const response = await fetch(`${API_BASE_URL}/search/?${queryString}`, {
      ...getDefaultOptions({
        method: 'GET',
      }),
    });
    return handleResponse(response);
  },

  async getDocument(id) {
    const response = await fetch(`${API_BASE_URL}/view/${id}/`, {
      ...getDefaultOptions({
        method: 'GET',
      }),
    });
    return handleResponse(response);
  },

  async updateDocument(id, query, colors) {  // Added update document endpoint
    const queryString = `query=${encodeURIComponent(query)}&colors=${encodeURIComponent(colors)}`;
    const response = await fetch(`${API_BASE_URL}/update_document/${id}?${queryString}`, {
      ...getDefaultOptions({
        method: 'GET',
      }),
    });
    return handleResponse(response);
  },

  async saveSession(sessionData) {
    const response = await fetch(`${API_BASE_URL}/save_session/`, {
      ...getDefaultOptions({
        method: 'POST',
        body: JSON.stringify(sessionData),
      }),
    });
    return handleResponse(response);
  },

  async loadSession(sessionKey) {
    const response = await fetch(`${API_BASE_URL}/load_session/`, {
      ...getDefaultOptions({
        method: 'POST',
        body: JSON.stringify({ session_key: sessionKey }),
      }),
    });
    return handleResponse(response);
  },

  async logout() {  // Added logout endpoint
    const response = await fetch(`${API_BASE_URL}/logout/`, {
      ...getDefaultOptions({
        method: 'POST',
      }),
    });
    return handleResponse(response);
  },

  async fetchDocument(id) {  // Added fetch document endpoint
    const response = await fetch(`${API_BASE_URL}/fetch_document/${id}`, {
      credentials: 'include',
      method: 'GET',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch document');
    }
    return response;  // Return the response directly for file downloads
  },
};