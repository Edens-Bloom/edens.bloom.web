export const up = async function (knex) {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("total_price");
    table.decimal("subtotal", 10, 2).notNullable().defaultTo(0);
    table.decimal("tax_amount", 10, 2).notNullable().defaultTo(0);
    table.decimal("discount_amount", 10, 2).notNullable().defaultTo(0);
    table.decimal("shipping_fee", 10, 2).notNullable().defaultTo(0);
    table.decimal("total_amount", 10, 2).notNullable().defaultTo(0);
  });

  await knex.schema.alterTable("order_items", (table) => {
    table.decimal("subtotal", 10, 2).notNullable().defaultTo(0);
  });
};

export const down = async function (knex) {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("subtotal");
    table.dropColumn("tax_amount");
    table.dropColumn("discount_amount");
    table.dropColumn("shipping_fee");
    table.dropColumn("total_amount");
    table.decimal("total_price", 10, 2);
  });

  await knex.schema.alterTable("order_items", (table) => {
    table.dropColumn("subtotal");
  });
};
