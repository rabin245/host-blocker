import axios from "axios";
import useSWR from "swr";

function extractDataFromStream(dataStream) {
  const lines = dataStream.split("\n");
  const extractedData = { date: "", hosts: [] };

  for (const line of lines) {
    if (line.startsWith("# Date:")) {
      extractedData.date = line.substring(8).trim();
    } else if (line.startsWith("0.0.0.0")) {
      const address = line.split(/\s+/)[1];
      const formattedHost = {
        trigger: {
          urlFilter: address,
        },
        action: {
          type: "block",
        },
      };
      extractedData.hosts.push(formattedHost);
    }
  }

  extractedData.hosts = JSON.stringify(extractedData.hosts);

  return extractedData;
}

export const fetcher = (url) =>
  axios(url).then((res) => extractDataFromStream(res.data));

const useHostsLists = (api) => {
  const { data, error, isValidating } = useSWR(api, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    suspense: true,
  });

  if (error) {
    return {
      error,
      data: null,
      isValidating,
    };
  }

  if (!data) {
    return {
      date: null,
      hosts: [],
      isValidating,
    };
  }
  return { ...data, isValidating };
};

export { useHostsLists };
