import * as mysql from 'mysql2/promise'
const tables = ['game','contestant']
import {game, contestant} from './schemas'
async function updateTables(pool: mysql.Pool) {
    
    const [results,_fields]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = (await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'royale'"))
    let curTables = []
    for (let table of results) {
        curTables.push(table.TABLE_NAME)
    }
    for (let table of tables) {
        const tableSchema = table === "game" ? game : contestant
        if (!curTables.includes(table)) {
            let str = `CREATE TABLE ${table} (`
            for(let i of Object.keys(tableSchema)) {
                str += `${i} ${tableSchema[i].Type} ${tableSchema[i].Null === "NO" ? 'NOT NULL, ' : ', '}`
                if(tableSchema[i].Key) {
                    str+= `${tableSchema[i].KeyBad}, `
                }
            }
            let ind = str.lastIndexOf(',')
            str = str.slice(0,ind)+str.slice(ind+1)
            str += ")"
            await pool.query(str)
        } else {
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
                    good.push(entry.Field as string)
                }
            }
            for(let i of Object.keys(tableSchema)) {
                if (!modify.includes(i) && !good.includes(i)) {
                    add.push(i)
                }
            }
            let str = `ALTER TABLE ${table} `
            let len = str.length
            for (let i of add) {
                str += `ADD ${i} ${tableSchema[i].Type} ${tableSchema[i].Null === "NO" ? 'NOT NULL, ' : ', '}`
                if(tableSchema[i].Key) {
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
                console.log(str)
                console.log(await pool.query(str.trimEnd().substring(0,str.length-2)))
            }
            
        }
    }
}

export default updateTables