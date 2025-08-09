import axios from "axios";

const usePost = () => {
  const postData = async (url, data, token, method = 'POST') => {
    const controller = new AbortController();

    let result;

    try {
      const config = {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response;

      switch (method.toUpperCase()) {
        case 'PUT':
          response = await axios.put(url, data, config);
          break;
        case 'PATCH':
          response = await axios.patch(url, data, config);
          break;
        case 'DELETE':
          response = await axios.delete(url, config);
          break;
        case 'POST':
        default:
          response = await axios.post(url, data, config);
          break;
      }

      result = response;
    } catch (error) {
      console.log(error);
      throw error;
    }
    
    controller.abort();
    return result;
  };

  return postData;
};

export default usePost;