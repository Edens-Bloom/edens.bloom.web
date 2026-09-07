export const up = async function (knex) {
  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.decimal("old_price", 10, 2).nullable();
    table.string("category").notNullable();
    table.string("product_type").notNullable().defaultTo("others");
    table.string("image_url").nullable();
    table.string("badge").nullable();
    table.integer("rating").defaultTo(5);
    table.text("description").nullable();
    table.boolean("in_stock").defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("product_packages", (table) => {
    table.increments("id").primary();
    table
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.string("label").notNullable();
    table.integer("buy_quantity").notNullable();
    table.integer("free_quantity").notNullable().defaultTo(0);
    table.integer("sort_order").defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.boolean("is_deleted").defaultTo(false);
    table.string("image_url").nullable();
    table.timestamp("deleted_at").nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("product_addons", (table) => {
    table.increments("id").primary();
    table
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.string("label").notNullable();
    table.decimal("price", 10, 2).notNullable().defaultTo(0.0);
    table.boolean("is_default").defaultTo(false);
    table.integer("sort_order").defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.boolean("is_deleted").defaultTo(false);
    table.string("image_url").nullable();
    table.timestamp("deleted_at").nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("customers", (table) => {
    table.increments("id").primary();
    table.string("phone", 20).unique().notNullable();
    table.string("name", 100).nullable();
    table.string("email", 100).nullable();
    table.string("address", 255).nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("carts", (table) => {
    table.increments("id").primary();
    table
      .integer("customer_id")
      .unsigned()
      .references("id")
      .inTable("customers")
      .onDelete("CASCADE");
    table.string("status", 20).notNullable().defaultTo("active");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("cart_items", (table) => {
    table.increments("id").primary();
    table
      .integer("cart_id")
      .unsigned()
      .references("id")
      .inTable("carts")
      .onDelete("CASCADE");
    table
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table
      .integer("package_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("product_packages")
      .onDelete("SET NULL");
    table
      .integer("addon_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("product_addons")
      .onDelete("SET NULL");
    table.integer("quantity").notNullable().defaultTo(1);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table
      .integer("customer_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("customers")
      .onDelete("SET NULL");
    table.string("status", 20).notNullable().defaultTo("pending");
    table.decimal("total_price", 10, 2).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("order_items", (table) => {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .integer("product_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("products")
      .onDelete("SET NULL");
    table
      .integer("package_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("product_packages")
      .onDelete("SET NULL");
    table
      .integer("addon_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("product_addons")
      .onDelete("SET NULL");
    table.integer("buy_quantity").notNullable();
    table.integer("free_quantity").notNullable().defaultTo(0);
    table.integer("total_quantity").notNullable();
    table.decimal("price_at_order", 10, 2).notNullable();
    table.decimal("addon_price_at_order", 10, 2).notNullable().defaultTo(0.0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").unique().notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("role").defaultTo("admin");
    table.timestamps(true, true);
  });
};

export const down = async function (knex) {
  await knex.schema.dropTableIfExists("order_items");
  await knex.schema.dropTableIfExists("orders");
  await knex.schema.dropTableIfExists("cart_items");
  await knex.schema.dropTableIfExists("carts");
  await knex.schema.dropTableIfExists("customers");
  await knex.schema.dropTableIfExists("product_addons");
  await knex.schema.dropTableIfExists("product_packages");
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("products");
};
