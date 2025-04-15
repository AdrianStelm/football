const express = require("express");
const router = express.Router();
const path = require("path");
const userController = require("../controllers/Users/userController");
const articleController = require("../controllers/News/newsController");
const filePath = path.join(__dirname, "..", "..", "client", "src", "public");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const passport = require("passport");
const upload = require("../controllers/storage");
const { check } = require("express-validator");
const footballApi = require("../api/footballApi.js");

router.get("/league/:id", async (req, res) => {
  const idLeague = req.params.id;
  const season = req.query.season || "2024-2025";

  const leagues = await footballApi.getLeagues();
  const uLeagues = leagues.filter(
    (league, index, self) => index === self.findIndex((l) => l.id === league.id)
  );
  const matches = await footballApi.getTodayMatches();
  const tableData = await footballApi.getTableOfSeason(idLeague, season);
  res.render(path.join(filePath, "index"), {
    user: req.cookies?.token,
    leagues: uLeagues,
    table: tableData.table,
    matches,
  });
});

router.get("/", async (req, res) => {
  const leagues = await footballApi.getLeagues();
  const uLeagues = leagues.filter(
    (league, index, self) => index === self.findIndex((l) => l.id === league.id)
  );
  const tableData = await footballApi.getTableOfSeason("4354", "2024-2025");
  const matches = await footballApi.getTodayMatches();

  res.render(path.join(filePath, "index"), {
    user: req.cookies.token,
    leagues: uLeagues,
    table: tableData.table,
    matches,
  });
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(filePath, "Register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(filePath, "log_in.html"));
});

router.get("/change-password/:token", (req, res) => {
  res.render(path.join(filePath, "forgot_password"), {
    token: req.params.token,
  });
});

router.get("/forgot-password", (req, res) => {
  res.sendFile(path.join(filePath, "enter_gmail.html"));
});

router.get("/create-article", (req, res) => {
  res.sendFile(path.join(filePath, "add_news.html"));
});

router.post(
  "/register",
  [
    check("username", "Username can`t be empty").notEmpty(),
    check(
      "password",
      "Password should have 4 and more symbols and don`t have more than 16 symbols"
    ).isLength({ min: 4, max: 16 }),
  ],
  userController.registration
);
router.post("/login", userController.login);
router.post("/forgot-password", userController.retrievePassword);
router.post("/change-password/:token", userController.updatePassword);
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["Admin"]),
  userController.getUsers
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  userController.loginWithGoogle
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  userController.loginWithGoogle
);

router.get("/articles", articleController.getArticles);
router.get("/article/:id", articleController.getArticle);

router.post(
  "/create-article",
  authMiddleware,
  roleMiddleware(["User", "Admin"]),
  upload.single("image"),
  articleController.createArticle
);
router.put(
  "/edit-article/:id",
  authMiddleware,
  roleMiddleware(["User", "Admin"]),
  upload.single("newImage"),
  articleController.editArticle
);
router.delete(
  "/delete-article/:id",
  authMiddleware,
  roleMiddleware(["User", "Admin"]),
  articleController.deleteArticle
);
router.post(
  "/articles/:id/like",
  roleMiddleware(["User", "Admin"]),
  articleController.likeArticle
);
router.post(
  "/articles/:id/write-comment/",
  authMiddleware,
  roleMiddleware(["User", "Admin"]),
  articleController.writeComment
);
router.get("/logout", userController.logout);

module.exports = router;
