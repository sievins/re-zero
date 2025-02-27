import { Client } from "pg";

let numberOfAttempts = 0;

async function warmUpDB() {
  let connected = false;
  while (!connected) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    try {
      numberOfAttempts++;

      await client.connect();

      console.log("Database connection active");
      connected = true;
    } catch (error) {
      if (numberOfAttempts >= 10) {
        console.error(error);
        throw new Error("Waited 30 seconds for a connection to the DB");
      }

      console.log("Waiting for DB to resume...");
      await new Promise((res) => setTimeout(res, 3000));
    } finally {
      try {
        await client.end();
      } catch (error) {
        console.error("Failed to close client", error);
      }
    }
  }
}

warmUpDB().catch((err) => {
  console.error("Error warming up the DB:", err);
  process.exit(1);
});
