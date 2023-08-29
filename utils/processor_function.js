import axios from "axios";

function processHostsFile(hostsContent) {
  const lines = hostsContent.split("\n");
  const blockList = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("0.0.0.0")) {
      const parts = trimmedLine.split(/\s+/);
      if (parts.length >= 2) {
        const domain = parts[1];
        if (domain !== "0.0.0.0") {
          blockList.push(domain);
        }
      }
    }
  }

  const jsonOutput = {
    action: {
      type: "block",
    },
    trigger: {
      "url-filter": blockList,
    },
  };

  return jsonOutput;
}

const hostsContent = await axios(
  "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts"
).then((response) => processHostsFile(response.data));
//   .then((text) => processHostsFile(text));

console.log(hostsContent);
