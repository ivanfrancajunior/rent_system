import app from "./server";
import "./config/dbConnection";

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
