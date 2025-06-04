
//Schema objects to provide type adherence
interface Schema {
    [key:string]: SchemaObject;
}

interface SchemaObject {
    [key2:string] : string;
}

//Schema is in roughly the same format as sql DESCRIBE
//KeyBad is the SQL statement that is added when the Key does not match DESCRIBE
//Foreign keys will not work on modifying existing columns for now
const GameSchema : Schema = {
     id : {Type:'varchar(16)',Null:'NO', Key: 'PRI', KeyBad: 'primary key(id)'},
     gameName : {Type:'varchar(40)',Null:'YES'},
     guildid : {Type:'bigint unsigned',Null:'NO'},
     userid: {Type:'varchar(50)', Null: 'NO'},
     autoprogress : {Type:'tinyint(1)',Null:'YES'},
     progressCooldown: {Type:'int',Null:'YES'},
     started:{Type:'tinyint(1)',Null:'YES'}
}

const ContestantSchema : Schema = {
    contestantid: {Type:'varchar(32)',Null:'NO', Key: 'PRI', KeyBad: 'primary key(contestantid)'},
    gameid: {Type:'varchar(16)',Null:'NO', KeyBad: 'foreign key(gameid) references game(id)'},
    district: {Type:'tinyint(1)',Null:'NO'},
    name : {Type:'varchar(16)',Null:'NO'},
    imageurl : {Type:'varchar(256)',Null:'YES'},
    dead : {Type:'tinyint(1)',Null:'YES'}
}

export const game = GameSchema;
export const contestant = ContestantSchema;