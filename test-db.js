import { drizzle } from "drizzle-orm/mysql2";
try {
  drizzle("mysql://user:pass@host:3306/db");
  console.log("Success");
} catch (e) {
  console.error("Error:", e.message);
}
