let listOfLeagues = [];

async function getLeagues() {
  try {
    const response = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php");
    const data = await response.json(); 
      let footballLeagues = [];

      data.leagues.filter((league) => {
          if(league.strSport == 'Soccer')
            footballLeagues.push({ nameLeague: league.strLeague, id: league.idLeague})
      })
    console.log(footballLeagues)
    
  } catch (error) {
    console.error("Помилка:", error);
    return null;
  }
}

getLeagues()

async function getTableOfSeason(idLeague,season){
  try {
    const response = await fetch(`https://www.thesportsdb.com///api/v1/json/3/lookuptable.php?l=${idLeague}&s=${season}`)
    const data = await response.json();
    console.log(data.table)
  } catch(error) {
    console.error("Помилка:",error)
  }
}

getTableOfSeason('4354','2024-2025')
