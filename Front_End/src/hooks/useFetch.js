import useAxiosPrivate from "./useAxiosPrivate";

const useFetch = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchData = async (url, token) => {
    const controller = new AbortController();

    let data;

    try {
      const response = await axiosPrivate.get(url, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      data = response.data;
    } catch (error) {
      console.log(error);
      return error;
    }

    controller.abort();
    return { data };
  };

  return fetchData;
};

export default useFetch;