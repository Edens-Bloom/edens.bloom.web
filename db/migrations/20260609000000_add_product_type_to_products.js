export const up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("products", "product_type");
  if (!hasColumn) {
    await knex.schema.alterTable("products", (table) => {
      table.string("product_type").notNullable().defaultTo("others");
    });
  }

  await knex("products")
    .whereNull("product_type")
    .update({ product_type: "others" });
};

export const down = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("products", "product_type");
  if (hasColumn) {
    await knex.schema.alterTable("products", (table) => {
      table.dropColumn("product_type");
    });
  }
};
