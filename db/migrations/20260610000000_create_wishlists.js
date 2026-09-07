export const up = async function (knex) {
  await knex.schema.createTable("wishlists", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique(["user_id", "product_id"], {
      indexName: "wishlists_user_product_unique",
    });
    table.index(["user_id"], "wishlists_user_id_idx");
  });
};

export const down = async function (knex) {
  await knex.schema.dropTableIfExists("wishlists");
};