//This command will allow users to create a game, then start configuring it.
//<gameName>

//  Table:
//  id : string             # The custom id generated for each game. Preferrably less than 6 characters.
//  gameName : string       # The name given to the game by the user, not unique.
//  guildid : string        # The id of the guild this game was created for. Since you can reference specific users, this is required for each game.
//  autoprogress : boolean  # Whether the bot should continuously progress the game once it starts
//  progressCooldown: int   # Milliseconds of how often the bot should send an update (each update should be one day or one morning/evening at a time)
//  started: boolean        # Whether the game has started or not. If the game has not been started or interacted with for an hour it will be deleted.
//  