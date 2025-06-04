import { RowDataPacket } from "mysql2";

interface Game extends RowDataPacket {
    id : string;                // The custom id generated for each game. Preferrably less than 6 characters.
    gameName : string;          // The name given to the game by the user, not unique.
    guildid : number;           // The id of the guild this game was created for. Since you can reference specific users, this is required for each game.
    userid: string,
    autoprogress : boolean;     // Whether the bot should continuously progress the game once it starts
    progressCooldown: number | null;   // Milliseconds of how often the bot should send an update (each update should be one day or one morning/evening at a time)
    started: boolean;    
}

interface Contestant extends RowDataPacket {
    contestantid: string
    gameid: string
    district: number
    name : string
    imageurl : string
    dead : boolean
}

export {Game, Contestant}