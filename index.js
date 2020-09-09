require("dotenv").config();
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

require("./auth");

const app = express();
const loginForm = '<a href=/auth/google>Login</a>'

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({ name: "session", keys: ["key1", "key2"] }));
app.use(passport.initialize());
app.use(passport.session());

const getMessages = async (token) => {
  const { data } = await axios.get(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { format: "FULL" },
    }
  );
  return data;
};

app.get("/", async (req, res) => {
  if (!req.user) return res.send(loginForm);

  try {
    const { messages } = await getMessages(req.user.accessToken);
    res.json(messages);
  } catch (err) {
    console.error(err.message)
    req.logOut()
    return res.send(loginForm);
  }
});

app.get("/failure", (req, res) => res.send("Login Error..."));

app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://mail.google.com/"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.listen(3002, console.log("Running.."));
