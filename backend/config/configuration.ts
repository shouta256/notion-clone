export default () => ({
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: Number.parseInt(process.env.DATABASE_PORT || "3306", 10),
    username: process.env.DATABASE_USER || "test",
    password: process.env.DATABASE_PASSWORD || "password",
    name: process.env.DATABASE_NAME || "test",
  },
});
