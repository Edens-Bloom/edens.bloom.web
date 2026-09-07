import dotenv from "dotenv";

dotenv.config();

const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// export default {
//   development: {
//     client: "pg",
//     connection,
//     migrations: {
//       directory: "./db/migrations",
//       tableName: "knex_migrations",
//     },
//   },
//   production: {
//     client: "pg",
//     connection,
//     migrations: {
//       directory: "./db/migrations",
//       tableName: "knex_migrations",
//     },
//   },
// };
