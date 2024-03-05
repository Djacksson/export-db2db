/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('t_users', function(table) {
        table.increments('id').primary();
        table.string('username').nullable();
        table.string('email').nullable().unique();
        table.string('password').nullable();
        table.integer('status').nullable();

        //****************foreign key*************************//
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('t_users');
};
