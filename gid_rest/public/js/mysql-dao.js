var mysql = require('mysql');
var config = require('./config');

HOST      = config.mysql.host;
PORT      = config.mysql.port;
USER      = config.mysql.user;
PASSWORD  = config.mysql.password;
DATABASE  = config.mysql.database;
TABLE     = config.mysql.table;

/* Example
var mysql = require('./mysql-dao.js');
mysql.query('phone', '01012341234', rows => { console.log(rows); });
*/
exports.query = (column, key, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'SELECT gid, name, phone FROM ' + TABLE + ' WHERE ' + column + '= ?', key,
    (err, rows, fields) => {
      if (err) throw err;

      if (rows.length == 0) {
        callback(null);
      }
      else callback(rows);
    }
  );
  db.end();
}

/* Example
mysql.queryAll(rows => { console.log(rows); });
*/
exports.queryAll = callback => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'SELECT * FROM ' + TABLE,
    (err, rows, fields) => {
      if (err) throw err;

      if (rows.length == 0) {
        callback(null);
      }
      else callback(rows);
    }
  );
  db.end();
}

/* Example
mysql.insert({gid:'12345', name:'abc', phone:'01012341234'}, result => {});
*/
exports.insert = (data, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'INSERT INTO ' + TABLE + ' (gid, name, phone) VALUES (?, ?, ?)',
    [data.gid, data.name, data.phone],
    (err, result) => {
      if (err) throw err;
      callback(result);
    }
  );
  db.end();
}

/* Example
mysql.delete('gid', '12345', result => {});
*/
exports.delete = (column, key, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'DELETE FROM ' + TABLE + ' WHERE ' + column + '= ?', key,
    (err, result) => {
      if (err) throw err;
      callback(result);
    }
  );
  db.end();
}

/* Example
mysql.update({gid:'12345', name:'abc', phone:'01012341234'}, result => {});
*/
exports.update = (data, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'UPDATE ' + TABLE + ' SET name = ?, phone = ? WHERE gid = ?',
    [data.name, data.phone, data.gid],
    (err, result) => {
      if (err) throw err;
      callback(result);
    }
  );
  db.end();
}

function connect() {

  var connection = mysql.createConnection({
    host      : HOST,
    port      : PORT,
    user      : USER,
    password  : PASSWORD,
    database  : DATABASE
  });

  return connection;
}
