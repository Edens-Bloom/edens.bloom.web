export const up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("products", "is_active");

  if (!hasColumn) {
    await knex.schema.alterTable("products", (table) => {
      table.boolean("is_active").notNullable().defaultTo(true);
    });
  }

  await knex("products").whereNull("is_active").update({ is_active: true });
};

export const down = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("products", "is_active");

  if (hasColumn) {
    await knex.schema.alterTable("products", (table) => {
      table.dropColumn("is_active");
    });
  }
};
