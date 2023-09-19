import axios from "axios";
import { writeFileSync } from "fs";

// Define an array of URLs
const urls = [
  {
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
    name: "basicRules.json",
  },
  {
    url:
      "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts",
    name: "fakeNewsRules.json",
  },
  {
    url:
      "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts",
    name: "gamblingRules.json",
  },
  {
    url:
      "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts",
    name: "pornRules.json",
  },
  {
    url:
      "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts",
    name: "socialRules.json",
  },
];

// Function to fetch and convert hosts to the desired format
const convertHosts = async () => {
  try {
    let id = 1;
    urls.forEach(async (uri) => {
      const url = uri.url;
      const response = await axios.get(url, { responseType: "text" });
      const lines = response.data.split("\n");

      const formattedHosts = [];

      lines.forEach((line) => {
        if (line.startsWith("0.0.0.0")) {
          const parts = line.split(/\s+/);
          if (parts.length >= 2) {
            const urlFilter = parts[1];
            const resourceTypes = ["main_frame", "script"];

            formattedHosts.push({
              id: id++,
              priority: 1,
              action: { type: "block" },
              condition: {
                urlFilter,
                resourceTypes,
              },
            });
          }
        }
      });

      // Write the formatted hosts to a JSON file
      const fileName = uri.name;
      writeFileSync(fileName, JSON.stringify(formattedHosts, null, 2));

      console.log(
        `Conversion for ${url} completed. Data written to ${fileName}`,
      );
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
};

convertHosts();
