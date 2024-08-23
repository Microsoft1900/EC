
var need = 3; 
var mainTimer = Timers.GetContext().Get("Main"); 
var stateProp = Properties.GetContext().Get("State"); 
var defTickTimer = Timers.getContext().Get("DefTimer"); 
var pls = []; 
Damage.FriendlyFire = GameMode.Parameters.GetBool("FriendlyFire"); 
Damage.GetContext().FriendlyFire.Value = true; 
Map.Rotation = GameMode.Parameters.GetBool("MapRotation"); 
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool("PartialDesruction"); 
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool("LoosenBlocks"); 
BreackGraph.PlayerBlockBoost = true; 
Properties.GetContext().GameModeName.Value = "GameModes/Team Dead Match"; 
Ui.GetContext().MainTimerId.Value = mainTimer.Id; 
 
Teams.Add("Blue", "#Игроки", { 
 r: 185, 
 g: 188, 
 b: 22 
}); 
Teams.Add("Red", "☠︎Мертвые☠︎", { 
 r: 400, 
 g: 0,  
 b: 400 
}); 
var blueTeam = Teams.Get("Blue"); 
var redTeam = Teams.Get("Red"); 
Spawns.GetContext().SpawnPointsGroups.Add(1); 
blueTeam.Spawns.SpawnPointsGroups.Add(1); 
redTeam.Spawns.SpawnPointsGroups.Add(2); 
Teams.Get("Blue").Properties.Get("Deaths").Value = blueTeam.GetAlivePlayersCount(); 
redTeam.Spawns.RespawnTime.Value = Infinity; 
redTeam.Ui.Hint.Value = "Ожидайте новую игру"; 
 
Teams.OnRequestJoinTeam.Add(function(player, team) { 
 if(stateProp.Value == "Game")redTeam.Add(player); 
  else { 
  blueTeam.Add(player); 
  player.Spawns.Spawn(); 
 } 
}); 
 
Teams.OnPlayerChangeTeam.Add(function(player) { 
 if(stateProp.Value == "Game" && player.Team == blueTeam){ 
sumCount(); 
player.Spawns.Spawn(); 
}else if(stateProp.Value == "EndOfMatch" && player.Team == blueTeam) player.Spawns.Spawn(); 
 if(player.Team == redTeam) player.Spawns.Spawn(); 
}); 
 
Damage.OnDeath.Add(function(player) { 
 if(player.Properties.Kills.Value == 1) { 
  Ui.GetContext().Hint.Value = "Маньяк умер☠︎"; 
  SetEndOfMatchMode(); 
 } else if(stateProp.Value == "Game" && player.Team == blueTeam) { 
  redTeam.Add(player); 
  Ui.GetContext().Hint.Value = player + " ➤ Убили"; 
 } 
 if(stateProp.Value !== "Game")player.Spawns.Spawn(); 
}); 
 
mainTimer.OnTimer.Add(function() { 
 switch(stateProp.Value) { 
  case "Waiting": 
   if(Players.Count < need) { 
    SetWaitingMode(); 
    Ui.GetContext().Hint.Value = "Нужно игроков как минимум: " + (need - Players.Count); 
   } else { 
    SetBuildMode(); 
   } 
   break; 
  case "BuildMode": 
   SetGameMode(); 
   break; 
  case "Game": 
   Ui.GetContext().Hint.Value = "Время вышло ⏲"; 
   SetEndOfMatchMode(); 
   break; 
  case "EndOfMatch": 
   if(Players.Count >= need) SetBuildMode(); 
   else SetWaitingMode(); 
   break; 
 } 
}); 
 
var inventory = Inventory.GetContext(); 
if(GameMode.Parameters.GetBool("OnlyKnives")) { 
  inventory.Main.Value = false; 
  inventory.Secondary.Value = false; 
  inventory.Melee.Value = false; 
  inventory.Explosive.Value = false; 
  inventory.Build.Value = false; 
 }else{ 
inventory.Main.Value = false; 
inventory.Secondary.Value = false; 
inventory.Melee.Value = false; 
inventory.Explosive.Value = false; 
inventory.Build.Value = false; 
} 
 
SetWaitingMode(); 
Players.OnPlayerDisconnected.Add(function(player) { 
 if(player.Properties.Kills.Value == 1) { 
  Ui.GetContext().Hint.Value = "убийца покинул игру ✖"; 
  SetEndOfMatchMode(); 
 } 
}); 
 
function SetWaitingMode() { 
 stateProp.Value = "Waiting"; 
 Ui.GetContext().Hint.Value = "Ожидание игроков"; 
 mainTimer.Restart(5); 
} 
 
function SetBuildMode() { 
 stateProp.Value = "BuildMode"; 
 Ui.GetContext().Hint.Value = "маньяк будет выбран через 20 секунд ⏲"; 
 mainTimer.Restart(20); 
} 
 
function SetGameMode() { 
 stateProp.Value = "Game"; 
 addAll(); 
setRandMurd();  
 Ui.GetContext().TeamProp1.Value = { 
  Team: "Blue", 
  Prop: "Deaths" 
 }; 
defTickTimer.RestartLoop(1); 
 mainTimer.Restart(220); 
} 
 
function SetEndOfMatchMode() {

stateProp.Value = "EndOfMatch"; 
 Ui.GetContext().Hint.Value += ", новая игра скоро начнётся!"; 
 Ui.GetContext().TeamProp1.Value = null; 
 tryClearMurd(); 
 addAll(); 
 SpawnTeams(); 
 defTickTimer.RestartLoop(500); 
 mainTimer.Restart(15); 
} 
 
function setRandMurd() { 
 e = Players.GetEnumerator(); 
 while(e.moveNext()) { 
  pls.push(e.Current); 
 } 
 mrd = Math.floor(Math.random() * Players.Count); 
if(pls[mrd].Properties.Lvl.Value >= 25)setMurd(pls[mrd]); 
else setRandMurd(); 
} 
 
function setMurd(player) { 
 Ui.GetContext().Hint.Value = player + "  ➤ Маньяк⚔"; 
 player.Properties.Kills.Value = 1; 
 player.Ui.Hint.Value = "ты Маньяк, устрани всех!"; 
 player.inventory.Melee.Value = false; 
 player.inventory.Secondary.Value = true; 
 player.inventory.SecondaryInfinity.Value = true; 
 player.Spawns.Spawn(); 
} 
 
function tryClearMurd() { 
 var e = Players.GetEnumerator(); 
 while(e.moveNext()) { 
  if(e.Current.Properties.Kills.Value == 1) { 
   e.Current.inventory.Melee.Value = false; 
   e.Current.inventory.Secondary.Value = false; 
   e.Current.Ui.Hint.Reset(); 
   e.Current.Properties.Kills.Value = 0; 
  } 
 } 
 pls = []; 
} 
 
defTickTimer.OnTimer.Add(function(timer) { 
 if(stateProp.Value !== "Game")return; 
 sumCount(); 
}); 
 
function sumCount() { 
if(stateProp.Value !== "Game")return; Teams.Get("Blue").Properties.Get("Deaths").Value = blueTeam.GetAlivePlayersCount() - 1; 
 if(blueTeam.GetAlivePlayersCount() == 1) { 
  Ui.GetContext().Hint.Value = "убийца победил"; 
  SetEndOfMatchMode(); 
 } 
} 
 
function addAll() { 
 var e = Players.GetEnumerator(); 
 while(e.moveNext()) { 
  if(e.Current.Team == null || e.Current.Team == redTeam)blueTeam.Add(e.Current); 
 } 
} 
 
function SpawnTeams() { 
 var e = Teams.GetEnumerator(); 
 while(e.moveNext()) { 
  Spawns.GetContext(e.Current).Spawn(); 
 } 
} 
 
//ввход в команду по запросу  
Teams.OnRequestJoinTeam.Add(function(player,team){team.Add(player); 
Ui.GetContext().Hint.Value = player +".    Привет";});
