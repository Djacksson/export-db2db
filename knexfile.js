// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_ROOT_HOST,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_ROOT_HOST,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    pool: {
      min: 2,
      max: 10
    },
  }
};
