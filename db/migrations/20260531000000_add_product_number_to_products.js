export const up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("products", "product_number");
  if (!hasColumn) {
    await knex.schema.alterTable("products", (table) => {
      table.string("product_number");
    });
  }

  const productsToFill = await knex("products")
    .select("id")
    .whereNull("product_number")
    .orderBy("id", "asc");

  for (let index = 0; index < productsToFill.length; index += 1) {
    await knex("products")
      .where({ id: productsToFill[index].id })
      .update({ product_number: `EB-${String(index + 1).padStart(4, "0")}` });
  }

  await knex.raw(
    "CREATE UNIQUE INDEX IF NOT EXISTS products_product_number_unique ON products (product_number)",
  );
  await knex.raw(
    "ALTER TABLE products ALTER COLUMN product_number SET NOT NULL",
  );
};

export const down = async function (knex) {
  await knex.raw("DROP INDEX IF EXISTS products_product_number_unique");
  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("product_number");
  });
};
