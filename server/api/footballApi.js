let footballLeagues = [];

class footballApi {
  async getLeagues() {
    try {
      const response = await fetch(
        "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php"
      );
      const data = await response.json();

      data.leagues.filter((league) => {
        if (
          league.strSport == "Soccer" &&
          league.strLeague !== "_No League" &&
          league.strLeague !== "Russian Football Premier League"
        )
          footballLeagues.push({
            nameLeague: league.strLeague,
            id: league.idLeague,
          });
      });
      return footballLeagues;
    } catch (error) {
      console.error("Помилка:", error);
      return null;
    }
  }

  async getTableOfSeason(idLeague, season) {
    try {
      const response = await fetch(
        `https://www.thesportsdb.com///api/v1/json/3/lookuptable.php?l=${idLeague}&s=${season}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Помилка:", error);
    }
  }

  async getTodayMatches() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const curDay = String(date.getDate() + 1).padStart(2, "0");
    const yesterdayDate = new Date(date);
    yesterdayDate.setDate(date.getDate());
    const prevDay = String(yesterdayDate.getDate()).padStart(2, "0");
    const prevMonth = String(yesterdayDate.getMonth() + 1).padStart(2, "0");
    const prevYear = yesterdayDate.getFullYear();

    const today = `${year}-${month}-${curDay}`;
    const yesterday = `${prevYear}-${prevMonth}-${prevDay}`;

    try {
      const response = await fetch(
        `https://api.football-data.org/v4/matches?dateFrom=${yesterday}&dateTo=${today}`,
        {
          headers: {
            "X-Auth-Token": process.env.FOOTBALL_API_KEY,
          },
        }
      );
      const data = await response.json();
      return data.matches;
    } catch (error) {
      console.error("Помилка при отриманні даних:", error);
    }
  }
}

module.exports = new footballApi();
