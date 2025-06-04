import * as mysql from 'mysql2/promise'
const tables = ['game','contestant']
import {game, contestant} from './schemas'
async function updateTables(pool: mysql.Pool) {
    
    //Get a list of tables in the database
    const [results,_fields]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = (await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'royale'"))
    let curTables = []
    for (let table of results) {
        curTables.push(table.TABLE_NAME)
    }

    //Go through each table in our schema and add/update it.
    for (let table of tables) {
        //Choose schema to work with
        const tableSchema = table === "game" ? game : contestant

        //If the table  doesn't already exist, create it
        if (!curTables.includes(table)) {
            let str = `CREATE TABLE ${table} (`

            //Add a line defining column name, type, null/not null, and any keys involving that value
            for(let i of Object.keys(tableSchema)) {
                str += `${i} ${tableSchema[i].Type} ${tableSchema[i].Null === "NO" ? 'NOT NULL, ' : ', '}`
                if(tableSchema[i].Key) {
                    str+= `${tableSchema[i].KeyBad}, `
                }
            }
            //slice off any extra commas
            let ind = str.lastIndexOf(',')
            str = str.slice(0,ind)+str.slice(ind+1)
            str += ")"
            //Try to add the table
            await pool.query(str)
        } else {
            //Get a description of the database. This includes Field (name), Key (PRI/UNI/MUL), Null (YES/NO), and Default
            //Ee compare the current description to the desired description (Schema) and alter based on that
            const [table_entries,_fields]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.query(`DESCRIBE ${table}`)
            let add: string[] = []
            let modify: string[] = []
            let drop: string[] = []
            let good: string[] = []

            //Identify all columns that need to be modified, dropped, or added.
            for (let entry of table_entries) {
                const cur_field = tableSchema[entry.Field]
                if(!cur_field) {
                    drop.push(entry.Field as string)
                }
                else if(cur_field.Type !== entry.Type || cur_field.Null !== entry.Null || (cur_field.Key && cur_field.Key !== entry.Key)) {
                    modify.push(entry.Field as string)
                } else {
                    //We need to keep track of if a column already exists in the table & matches the schema
                    good.push(entry.Field as string)
                }
            }
            //Put any entries that aren't in the DB into the add array
            for(let i of Object.keys(tableSchema)) {
                if (!modify.includes(i) && !good.includes(i)) {
                    add.push(i)
                }
            }

            //Define the ALTER TABLE string
            let str = `ALTER TABLE ${table} `
            let len = str.length
            for (let i of add) {
                str += `ADD ${i} ${tableSchema[i].Type} ${tableSchema[i].Null === "NO" ? 'NOT NULL, ' : ', '}`
                if(tableSchema[i].KeyBad) {
                    str+= `ADD ${tableSchema[i].KeyBad}, `
                }
            }
            for (let i of modify) {
                str += `MODIFY COLUMN ${i} ${tableSchema[i].Type} ${tableSchema[i].Null === "NO" ? 'NOT NULL, ' : ', '}`
                if(tableSchema[i].Key) {
                    str+= `ADD ${tableSchema[i].KeyBad}, `
                }
            }
            for (let i of drop) {
                str += `DROP COLUMN ${i}, `
            }
            if(str.length != len) {
                //we use substring to get rid of any extra commas
                console.log(await pool.query(str.trimEnd().substring(0,str.length-2)))
            }
            
        }
    }
}

export default updateTables