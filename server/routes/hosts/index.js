import axios from "axios";
import fs from "fs";

const hostSchema = {
  type: "object",
  required: ["basic", "fakeNews", "gambling", "porn", "socialMedia"],
  properties: {
    basic: {
      type: "boolean",
    },
    fakeNews: {
      type: "boolean",
    },
    gambling: {
      type: "boolean",
    },
    porn: {
      type: "boolean",
    },
    socialMedia: {
      type: "boolean",
    },
  },
};

function generateHostsUrl(filters) {
  console.log(filters, typeof filters);
  let baseUrl = "https://raw.githubusercontent.com/StevenBlack/hosts/master/";

  let filterTypes = "";
  let alternates = "";

  if (
    filters.fakeNews ||
    filters.gambling ||
    filters.porn ||
    filters.socialMedia
  )
    alternates = "alternates/";

  if (filters.fakeNews) {
    filterTypes += "fakenews";
  }

  if (filters.gambling) {
    if (filterTypes.length > 0) filterTypes += "-";
    filterTypes += "gambling";
  }

  if (filters.porn) {
    if (filterTypes.length > 0) filterTypes += "-";
    filterTypes += "porn";
  }

  if (filters.socialMedia) {
    if (filterTypes.length > 0) filterTypes += "-";
    filterTypes += "social";
  }

  if (!filters.basic) filterTypes += "-only";

  return baseUrl + alternates + filterTypes + "/hosts";
}

export default async function (fastify, opts) {
  fastify.post(
    "/block-hosts",
    { schema: { body: hostSchema } },
    async function (request, reply) {
      const hostsFilePath = "C:/Windows/System32/drivers/etc/hosts";
      const fileDescriptor = fs.openSync(hostsFilePath, "w");
      try {
        const filters = request.body;
        const allFiltersOff = Object.values(filters).every((value) => !value);

        if (allFiltersOff) {
          const content = "";

          fs.writeFileSync(fileDescriptor, content);
          console.log("All filters off. Clearing hosts file.");
          return reply.send({
            message: "No filters selected. Hosts file cleared.",
          });
        }

        const url = generateHostsUrl(filters);
        console.log(url);

        const response = await axios.get(url);

        if (response.status === 200) {
          const newHostsContent = response.data;

          fs.writeFileSync(fileDescriptor, newHostsContent);

          reply.send("Hosts file updated.");
        } else {
          reply.status(500).send("Failed to fetch hosts file.");
        }
      } catch (error) {
        console.error("Error updating hosts file:", error);

        reply
          .status(500)
          .send("An error occurred while updating the hosts file.");
      } finally {
        fs.closeSync(fileDescriptor);
      }
    }
  );
}
