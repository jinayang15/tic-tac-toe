function main() {
  const playerForm = document.getElementById("players");

  playerForm.addEventListener("submit", () => {
    const player1Name = document.getElementById("player_1").value.trim();
    const player2Name = document.getElementById("player_2").value.trim();

    if (player1Name != "" && player2Name != "") {
      localStorage.setItem("player_1", player1Name);
      localStorage.setItem("player_2", player2Name);
      console.log(localStorage.getItem("player_1"));
      console.log(localStorage.getItem("player_2"));
    }
  });
}

main();
