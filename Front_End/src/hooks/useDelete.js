const useDelete = () => {
  return async (url, token) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json();
  };
};

export default useDelete;