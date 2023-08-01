import pkg from "jsonwebtoken";
const { verify } = pkg;

function validate_Token(req, res, next) {
  const access_token = req.header("access_token");
  if (!access_token) return res.json({ error: "user not logged in" });
  try {
    const validtoken = verify(access_token, "iamtheSwat1*");
    console.log("at", access_token);
    if (validtoken) {
      const userId = validtoken.id;
      console.log(validtoken.id);
      console.log("User ID from token:", userId);
      req.userId = userId;
      req.access_token = access_token;
      return next();
    }
  } catch (err) {
    console.error("Token verification error:", err);
    return res.json({ error: err.message });
  }
}

export default validate_Token;
