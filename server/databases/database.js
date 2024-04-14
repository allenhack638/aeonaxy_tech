const postgres = require("postgres");
require("dotenv").config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

const deleteAllTables = async () => {
  try {
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' -- Assuming tables are in the public schema
    `;
    console.log("Tables to delete:", tables);

    // Drop each table in the list
    for (const table of tables) {
      await sql`
        DROP TABLE IF EXISTS ${sql(table.table_name)}
      `;
      console.log(`${table.table_name} deleted successfully.`);
    }

    console.log("All tables deleted successfully.");
  } catch (error) {
    console.error("Error deleting tables:", error.message);
  } finally {
    await sql.end(); // Close the database connection
  }
};

const deleteUserTable = async (tableName) => {
  try {
    const users = await sql`
      DELETE FROM ${sql(tableName)}
      RETURNING *
    `;
    console.log(`Deleted all users from table ${tableName}:`, users);
    console.log(`All users deleted successfully from table ${tableName}.`);
  } catch (error) {
    console.log(error);
    console.error(
      `Error deleting users from table ${tableName}:`,
      error.message
    );
  }
};

const updateTest = async () => {
  try {
    const updateQuery = await sql`
      UPDATE Users_table
      SET imageUrl = 'ALlenghe'
      WHERE email = 'allen@hjhgmail.com'
    `;
    console.log("Update query executed successfully:", updateQuery);
  } catch (error) {
    console.error("Error updating user image URL:", error);
  } finally {
    await sql.end(); // Close the database connection
  }
};

const deleteUserByEmail = async (email) => {
  try {
    const user = await sql`
      SELECT id
      FROM Users_table
      WHERE email = ${email}
    `;

    if (!user || user.length === 0) {
      console.error(`User with email ${email} not found.`);
      return;
    }

    const userId = user[0].id;

    await sql`
      DELETE FROM Users_table
      WHERE id = ${userId}
    `;

    console.log(
      `User with email ${email} and ID ${userId} deleted successfully.`
    );
  } catch (error) {
    console.error(`Error deleting user with email ${email}:`, error.message);
  }
};

const createSchemas = async () => {
  try {
    // Create Users table
    await sql`
      CREATE TABLE IF NOT EXISTS Users_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255), 
        imageUrl VARCHAR(255) DEFAULT NULL, 
        interests VARCHAR(255)[] DEFAULT '{}'::VARCHAR[],
        location VARCHAR(255) DEFAULT NULL,
        isVerified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Tables created successfully: Users_table");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await sql.end(); // Close the database connection
  }
};

const deleteAndCreate = async () => {
  await deleteAllTables();
  await createSchemas();
};

(async () => {
  // await deleteUserTable("users_table");
  // await deleteAndCreate();
  // await deleteUserByEmail("allenbenny41@gmail.com");
  // await deleteAllTables();
  // await deleteAllTablesWithCasecade();
  // await deleteSingleTable("users_table");
  // Call the createSchemas function
  // await createSchemas();
  // await updateTest();
})();

module.exports = sql;
