interface Schema {
    [key:string]: SchemaObject;
}

interface SchemaObject {
    [key2:string] : string;
}

const GameSchema : Schema = {
     id : {Type:'varchar(16)',Null:'NO', Key: 'PRI', KeyBad: 'primary key(id)'},
     gameName : {Type:'varchar(40)',Null:'YES'},
     guildid : {Type:'bigint',Null:'NO'},
     autoprogress : {Type:'tinyint(1)',Null:'YES'},
     progressCooldown: {Type:'int',Null:'YES'},
     started:{Type:'tinyint(1)',Null:'YES'}
}

const ContestantSchema : Schema = {
    contestantid: {Type:'varchar(32)',Null:'NO', Key: 'PRI', KeyBad: 'primary key(contestantid)'},
    gameid: {Type:'varchar(16)',Null:'NO', KeyBad: 'foreign key(contestantid) references game(id)'},
    district: {Type:'tinyint(1)',Null:'NO'},
    name : {Type:'varchar(16)',Null:'NO'},
    imageurl : {Type:'varchar(256)',Null:'YES'},
    dead : {Type:'tinyint(1)',Null:'YES'}
}

export const game = GameSchema;
export const contestant = ContestantSchema;