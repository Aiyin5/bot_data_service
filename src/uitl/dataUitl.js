const mysql = require('mysql');

class MysqlPool {
    constructor(config) {
        this.pool = mysql.createPool(config);
    }

    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
    }

    query(sql, args = []) {
        return new Promise(async (resolve, reject) => {
            const conn = await this.getConnection();
            conn.query(sql, args, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
                conn.release();
            });
        });
    }

    async select(tableName) {
        const sql = `SELECT * FROM ${tableName}`;
        return await this.query(sql);
    }

    async insert(tableName, data) {
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data).map(value => mysql.escape(value)).join(', ');
        const sql = `INSERT INTO ${tableName} (${keys}) VALUES (${values})`;
        return await this.query(sql);
    }

    async update(tableName, data, where) {
        const setValues = Object.entries(data)
            .map(([key, value]) => `${key} = ${mysql.escape(value)}`)
            .join(', ');
        const whereConditions = Object.entries(where)
            .map(([key, value]) => `${key} = ${mysql.escape(value)}`)
            .join(' AND ');
        const sql = `UPDATE ${tableName} SET ${setValues} WHERE ${whereConditions}`;
        return await this.query(sql);
    }

    async delete(tableName, where) {
        const whereConditions = Object.entries(where)
            .map(([key, value]) => `${key} = ${mysql.escape(value)}`)
            .join(' AND ');
        const sql = `DELETE FROM ${tableName} WHERE ${whereConditions}`;
        return await this.query(sql);
    }
}

module.exports = MysqlPool;
