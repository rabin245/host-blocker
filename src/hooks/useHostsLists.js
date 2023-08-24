import axios from "axios";
import useSWR from "swr";

function extractDataFromStream(dataStream) {
  const lines = dataStream.split("\n");
  const extractedData = { date: "", addresses: [] };

  for (const line of lines) {
    if (line.startsWith("# Date:")) {
      extractedData.date = line.substring(8).trim();
    } else if (line.startsWith("0.0.0.0")) {
      const address = line.split(/\s+/)[1];
      extractedData.addresses.push(address);
    }
  }

  return extractedData;
}

const fetcher = (url) =>
  axios(url).then((res) => extractDataFromStream(res.data));

export function useHostsLists(api) {
  const { data, error } = useSWR(api, fetcher);

  if (error) {
    return {
      error,
      data: null,
    };
  }

  if (!data) {
    return {
      error: null,
      data: null,
    };
  }
  console.log(data);
  return data;
}
