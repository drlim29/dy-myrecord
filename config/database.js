//mysql접속
var mysql = require('mysql');
var db_info = {
    host:'ec2-3-23-96-55.us-east-2.compute.amazonaws.com',
    port:3306,
    user : 'myrecord',
    password:'myrecord12##',
    database:'myrecord'
}

module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        // console.log(conn, 'database.js - conn')
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}