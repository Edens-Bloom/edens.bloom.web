export const up = async function (knex) {
  await knex.schema.createTable("design_requests", (table) => {
    table.increments("id").primary();
    table.string("full_name", 100).notNullable();
    table.string("phone", 20).notNullable();
    table.string("email", 100).nullable();
    table.text("description").notNullable();
    table.string("image_url").nullable();
    table
      .enum("status", ["pending", "viewed", "rejected", "approved"])
      .defaultTo("pending");
    table.timestamps(true, true);
  });
};

export const down = async function (knex) {
  await knex.schema.dropTableIfExists("design_requests");
  await knex.schema.raw("DROP TYPE IF EXISTS design_requests_status_check");
};
