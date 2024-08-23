//var Color = importNamespace('PixelCombats.ScriptingApi.Structures');
//var System = importNamespace('System');

// ����������
var  WaitingPlayersTime  =  10 ;
var  BuildBaseTime  =  60 ;
var  GameModeTime  =  1200 ;
var  EndOfMatchTime  =  10 ;
вар  InfTimer  =  1 ;  //время бесконечного таймера
var  myJust  =  0 ;
вар  myBluePlayers  =  0 ;  //количество людей
вар  myGameState  =  0 ;  //состояние игры
вар  myAllPlayers  =  0 ;  //количество всех игроков
вар  myGameStarted  =  0 ;  //начинаем игру
var  myBlockGameLoad  =  0 ;
var  WeaponAreasTag  =  "wp" ;
var  myRedPlayers  =  0 ;
var  myRedTeamBlock  =  0 ;
var  myBluePlayersAlive  =  0 ;
// �������� ����
var  WaitingStateValue  =  "Ожидание" ;
var  BuildModeStateValue  =  "BuildMode" ;
var  GameStateValue  =  "Игра" ;
var  EndOfMatchStateValue  =  "EndOfMatch" ;
var  myCount  =  Игроки.Количество ;
var  myInventoryBlock  =  0 ;

// ���������� ����������
var  mainTimer  =  Timers.GetContext ( ) . Get ( " Main " ) ;
var  myInfTimer  =  Timers.GetContext ( ) . Get ( " tim1 " ) ;
var  myWpTimer  =  Таймеры.GetContext ( ) . Get ( " tim2 " ) ;

var  myTimer3  =  Таймеры.GetContext ( ) . Get ( " tim3 " ) ;



var  stateProp  =  Свойства.GetContext ( ) . Get ( " Состояние " ) ;
var  weaponAreas  =  AreaService.GetByTag ( WeaponAreasTag ) ;

// �������� ���������� �������� ������
Damage.FriendlyFire = GameMode.Parameters.GetBool ( " FriendlyFire " ) ;  
Карта.Вращение = GameMode.Параметры.GetBool ( " MapRotation " ) ;  
BreakGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool ( " PartialDesruction " ) ;  
BreakGraph.WeakBlocks = GameMode.Parameters.GetBool ( " LoosenBlocks " ) ;  

// ���� ������ ������ ������
BreakGraph.PlayerBlockBoost = true ;  

// �������� ����
Свойства . GetContext ( ) . GameModeName . Value  =  "GameModes/Team Dead Match" ;
TeamsBalancer.IsAutoBalance = false ;  
Ui.GetContext ( ) . MainTimerId.Value = mainTimer.Id ;  
// �������� ������
Команды . Добавить ( "Blue" ,  "ЛЮДИ" ,  {  b : 150  } ) ;
Команды . Добавить ( "Красный" ,  "ЗОМБИ" ,  {  г : 150  } ) ;
var  blueTeam  =  Teams.Get ( " Blue " ) ;
var  redTeam  =  Teams.Get ( " Красные " ) ;
blueTeam.Spawns.SpawnPointsGroups.Add ( 1 ) ;
redTeam.Spawns.SpawnPointsGroups.Add ( 2 ) ;
blueTeam.Build.BlocksSet.Value = BuildBlocksSet.Blue ;  
redTeam.Build.BlocksSet.Value = BuildBlocksSet.Red ;  

// ������ ���� ������ ������

// ������ �� �������� � ����������
LeaderBoard . PlayerLeaderBoardValues  =  [
	{
		Значение : "Убивает" ,
		DisplayName : "Статистика/Убийства" ,
		ShortDisplayName : "Статистика/KillsShort"
	} ,
	{
		Значение : "Смерти" ,
		DisplayName : "Статистика/Смерти" ,
		ShortDisplayName : "Статистика/СмертиКоротко"
	} ,
	{
		Значение : "Спавн" ,
		DisplayName : "Статистика/Появления" ,
		ShortDisplayName : "Статистика/SpawnsShort"
	} ,
	{
		Значение : "Очки" ,
		DisplayName : "Статистика/Оценки" ,
		ShortDisplayName : "Статистика/РезультатыКраткие"
	}
] ;
Таблица лидеров . TeamLeaderBoardValue  =  {
	Значение : "Смерти" ,
	DisplayName : "Статистика\Смерти" ,
	ShortDisplayName : "Статистика\Смерти"
} ;
// �� ������ � ����������
LeaderBoard.TeamWeightGetter.Set ( function ( team ) { 
	return  team.Свойства.Получить ( " Смерти " ) . Значение ;
} ) ;
// �� ������ � ����������
LeaderBoard.PlayersWeightGetter.Set ( function ( player ) { 
	return  player.Свойства.Получить ( " Убийства " ) . Значение ;
} ) ;

// ������ ���� �������� ������

Ui.GetContext ( ) . TeamProp2.Value = { Team : " Red " , Prop : " Kills " } ;     



var  spawnsView  =  AreaViewService.GetContext ( ) . Get ( " SpawnsView " ) ; spawnsView.Color = { r : 150 , g : 150 , b : 0 } ;      
spawnsView.Теги = [ ТегОружияОбласти ] ;  
spawnsView .Включить =  true ; 

var  weaponTrigger  =  AreaPlayerTriggerService . Get ( "WeaponTrigger" ) ;
weaponTrigger.Tags = [ ТегОружияОбластиТег ] ;  
weaponTrigger.Enable = true ;  
weaponTrigger.OnEnter.Add ( function ( player ) {  
	если  ( игрок.Инвентарь.Ближний бой.Значение )
  {
    игрок . Уи . Намекать . Value  =  "ВЫ ЗОМБИ" ;
  }
  еще
  {
    myWpTimer.Перезапустить ( 180 ) ;
    weaponTrigger.Enable = false ;  
    spawnsView .Включить =  false ; 
    игрок.Инвентарь.Основной.Значение = false ;  
    игрок.Инвентарь.Основной.Значение = true ;  
  }
} ) ;


// ���������� ���� � ������� �� �������
Команды.OnRequestJoinTeam.Add ( функция ( игрок , команда ) {

  если  ( моеСостояниеИгры  ==  1 )
  {
    redTeam.Add ( игрок ) ;
    игрок . Порождает . Порождает ( ) ;
  }
  еще
  {
    команда . Добавить ( игрок )
  }
} ) ;
// ������ �� ����� � �������
Команды.OnPlayerChangeTeam.Add ( function ( player ) { player.Spawns.Spawn ( ) } ) ; 

// ������ ������ ���������� ���� ������

// ������ ������ ������ ������ �������� ���� ������ � ������ �

;
// ���� � ������ ���������� ������ ���������� �� ������ �� ����


// �������� ������
Spawns.OnSpawn.Add ( function ( player ) { 
	++ игрок . Свойства . Появляется . Значение ;
  игрок.Инвентарь.Основной.Значение = false ;  
  если  ( мойИнвентарьБлокирован  ==  1 )
  {
    игрок.Инвентарь.Сборка.Значение = false ;  
  }
} ) ;
// �������� ������
Damage.OnDeath.Add ( function ( player ) { 
  ++ игрок . Свойства . Смерти . Значение ;
} ) ;
// �������� ������
Damage.OnKill.Add ( function ( player , killing ) {  
	если  ( убит . Команда  !=  null  &&  убит . Команда  !=  игрок . Команда )  {
		++ игрок . Свойства . Убийства . Значение ;
		игрок . Свойства . Очки . Значение  +=  100 ;
	}
  если  ( моеСостояниеИгры  ==  1 )
  {
    redTeam.Add ( убит ) ;
  }
} ) ;

//таймеры

myInfTimer.OnTimer.Add ( function ( )
{
  myInfTimer.Restart ( InfTimer ) ;
  myBluePlayersAlive  =
blueTeam.GetAlivePlayersCount ( ) ;
  если  ( моеСостояниеИгры  ==  1 )
  {
    если  ( myBluePlayersAlive
==  0 )

    {
      InfTimer  =  1000 ;
      myInfTimer.Stop ( ) ;
      УстановитьКонецМатчаРежим ( ) ;
    }
  }
  если  ( моеСостояниеИгры  !=  1 )
  {
    если  ( моеКоличество  >  1 ) 
    {
      если  ( stateProp . Value  !=  BuildModeStateValue )
      {
        если  ( stateProp . Value  !=  GameStateValue )
        {
          УстановитьРежимСборки ( ) ;
        }
      }
    }
  }
  если  ( моеСостояниеИгры  ==  1 )
  {
    если  ( myRedPlayers  ==  0 )
    {
      InfTimer  =  1000 ;
      myInfTimer.Stop ( ) ;
      УстановитьКонецМатчаРежим ( ) ;
    }  
  }

  myCount  =  Игроки.Количество ;
  моиRedPlayers
=  Команды.Получить ( " Красные " ) . Количество ;

 моиBluePlayers
=  Команды.Получить ( " Синие " ) . Количество ;

  если  ( myRedPlayers  >  0 )
  {
    myRedTeamBlock  =  1 ;
  }
  еще
  {
    myRedTeamBlock  =  2 ;
  }
} ) ;

myTimer3.OnTimer.Add ( function ( )
{
  мойInventoryBlock  =  1 ;
  моеGameState  =  1 ;
  myRedTeamBlock  =  1 ;
} ) ;




// ���������� ������������ ������
mainTimer.OnTimer.Add ( function ( ) { 
	переключатель  ( stateProp . Значение )  {
	случай  WaitingStateValue :
		УстановитьРежимОжидания ( ) ;
		перерыв ;
	случай  BuildModeStateValue :
		УстановитьРежимИгры ( ) ;
		перерыв ;
	случай  GameStateValue :
		УстановитьКонецМатчаРежим ( ) ;
		перерыв ;
	случай  EndOfMatchStateValue :
		Перезапустить игру ( ) ;
		перерыв ;
	}
} ) ;

// ������ ������ ������ ��������
УстановитьРежимОжидания ( ) ;

// �������� ����
функция  УстановитьРежимОжидания ( )  {
	stateProp.Value = WaitingStateValue ;  
	Уи . Получитьконтекст ( ) . Намекать . Value  =  "НУЖНО БОЛЬШЕ ДВУХ ИГРОКОВ" ;
  myInfTimer.Restart ( InfTimer ) ;
  weaponTrigger.Enable = false ;  
  spawnsView .Включить =  false ; 
  var  inventory  =  Inventory.GetContext ( ) ;
	inventory.Main.Value = false ;  

  инвентарь . Вторичный . Значение  =  false ;
	        
  инвентарь . Ближний бой . Значение  =  false ;
  Инвентарь . Взрывчатка . Значение  =  false ;
 	inventory.Build.Value = false ;  
	Создает .GetContext ( ) .enable = true ;  
	mainTimer.Restart ( WaitingPlayersTime ) ;
}

функция  SetBuildMode ( ) 
{
	stateProp.Value = BuildModeStateValue ;  
	Уи . Получитьконтекст ( ) . Намекать . Value  =  "ОЖИДАЙТЕ" ;
	var  inventory  =  Inventory.GetContext ( ) ;
	inventory.Main.Value = false ;  
	инвентарь . Вторичный . Значение  =  false ;
	инвентарь . Ближний бой . Значение  =  false ;
	Инвентарь . Взрывчатка . Значение  =  false ;
	inventory.Build.Value = false ;  

	mainTimer.Restart ( BuildBaseTime ) ;
	Создает .GetContext ( ) .enable = true ;  
	SpawnTeams ( ) ;
}
функция  УстановитьИгровойРежим ( ) 
{
	stateProp.Value = GameStateValue ;  
	Уи . Получитьконтекст ( ) . Намекать . Value  =  "РЕЖИМ ОТ justToxiC" ;
  myTimer3.Перезапустить ( 3 ) ;

  weaponTrigger.Enable = true ;  
  spawnsView .Включить =  true ; 
	var  inventory  =  Inventory.GetContext ( ) ;
	если  ( GameMode.Parameters.GetBool ( " OnlyKnives " ) ) { 
		inventory.Main.Value = false ;  
		инвентарь . Вторичный . Значение  =  false ;
		инвентарь . Ближний бой . Значение  =  true ;
		Инвентарь . Взрывчатка . Значение  =  false ;
		inventory.Build.Value = true ;  
	}  еще  {
	  redTeam.Inventory.Main.Value = false ;  
    инвентарь . Вторичный . Значение  =  false ;
	  redTeam.Инвентарь.Ближний бой.Значение = true ;  
	  Инвентарь . Взрывчатка . Значение  =  false ;
	  blueTeam.Inventory.Build.Value = true ;  
	}

	mainTimer.Restart ( GameModeTime ) ;
	Порождает.GetContext ( ) . Despawn ( ) ;
	SpawnTeams ( ) ;
}
функция  SetEndOfMatchMode ( )  {
	stateProp.Value = EndOfMatchStateValue ;  
	Ui.GetContext ( ) . Hint.Value = " Hint / EndOfMatch " ;  

	var  spawns  =  Spawns.GetContext ( ) ;
	порождает . enable  =  false ;
	порождает . Исчезает ( ) ;
	Игра.GameOver ( LeaderBoard.GetTeams ( ) ) ;
	mainTimer.Restart ( EndOfMatchTime ) ;
}
функция  ПерезапуститьИгру ( )  {
	Игра.ПерезапуститьИгру ( ) ;
}

функция  SpawnTeams ( )  {
	вар  е  =  Команды . ПолучитьЭнумератор ( ) ;
	в то время как  ( е . moveNext ( ) )  {
		Spawns.GetContext ( e.Current ) .Spawn ( ) ;
	}
}

