export const up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("orders", "order_number");
  if (!hasColumn) {
    await knex.schema.alterTable("orders", (table) => {
      table.string("order_number");
    });
  }

  await knex.raw(
    "CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_unique ON orders (order_number)",
  );
  await knex.raw("ALTER TABLE orders ALTER COLUMN order_number SET NOT NULL");
};

export const down = async function (knex) {
  await knex.raw("DROP INDEX IF EXISTS orders_order_number_unique");
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("order_number");
  });
};
