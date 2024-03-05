/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable('t_cluster', function(table) {
        table.increments('id').primary();
        table.string('host').nullable();
        table.string('user').nullable().unique();
        table.string('password').nullable();
        table.string('database').nullable();
        table.integer('status').nullable();

        //****************foreign key*************************//
        table.integer('id_user', 10).unsigned();
        table.foreign('id_user').references('t_users.id');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('t_cluster');
};
