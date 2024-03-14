import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Config } from "@/components/ui/Workspace";

const { API_KEY } = process.env;

interface ApiError extends Error {
  status?: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, headers, body } = req;
    const client = await clientPromise;
    const db = client.db("nuotillee");

    if (!API_KEY) {
      throw new Error("API_KEY is not set");
    }

    const authorized = headers["x-api-key"] === API_KEY;

    switch (method) {
      case "GET":
        const workspaces = await db
          .collection<Config>("workspaces")
          .find({})
          .limit(10)
          .toArray();

        // Remove database id from response
        res.json(workspaces.map(({ _id, ...workspace }) => workspace));
        break;

      case "POST":
        if (!authorized) {
          const error: ApiError = new Error("Unauthorized");
          error.status = 401;
          throw error;
        }

        // Post will work as upsert
        const { id, height, width, title, view, windows } = body as Config;

        if (!id) {
          res.status(400).end();
          break;
        }

        // Insert or update data
        const data = { id, height, width, title, view, windows };
        const existing = await db.collection("workspaces").findOne({ id });

        if (existing) {
          await db.collection("workspaces").updateOne(
            {
              id,
            },
            {
              $set: data,
            }
          );
          res.json(data);
          return;
        }

        await db.collection("workspaces").insertOne(data);

        res.json(data);
        break;

      default:
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (e: ApiError | unknown) {
    console.error(e);
    res.status((e as ApiError).status || 500).end();
  }
};

export default handler;
