export const up = async function (knex) {
  await knex.raw(
    "CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers (phone)",
  );
};

export const down = async function (knex) {
  await knex.raw("DROP INDEX IF EXISTS customers_phone_idx");
};
