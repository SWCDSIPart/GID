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
    'SELECT value FROM ' + TABLE + ' WHERE ' + column + '= ?', key,
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
mysql.queryGID('ABCD1234', rows => { console.log(rows); });
*/
exports.queryGID = (gid, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'SELECT value FROM ' + TABLE + ' WHERE gid = ?', gid,
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
mysql.isExistGID('ABCD1234', result => { console.log(result); });
*/
exports.isExistGID = (gid, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    //'SELECT EXISTS (SELECT value FROM ' + TABLE + ' WHERE gid = ?)'
    'SELECT value FROM ' + TABLE + ' WHERE gid = ?', 
	gid,
	(err, rows, result) => {
	  if(err) throw err;

	  if (rows.length == 0) callback(false);
	  else callback(true);
	}
  );
  db.end();
}

/* Example
mysql.insert({gid:'12345', value:'{"name":"lee", "phone":"01012341234"}'}, result => {});
*/
exports.insert = (data, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'INSERT INTO ' + TABLE + ' (gid, value) VALUES (?, ?)',
    [data.gid, data.value],
    (err, result) => {
      if (err) throw err;

	  if (result.affectedRows > 0) callback('OK');
	  else callback(result.message);
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
mysql.deleteGID('ABCD1234', result => {});
*/
exports.deleteGID = (gid, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'DELETE FROM ' + TABLE + ' WHERE gid =?', gid,
	(err, result) => {
	  if (err) throw err;

	  if (result.affectedRows > 0) callback('OK');
	  else callback(result.message);
	}
  );
  db.end();
}

/* Example
mysql.updateGID({gid:'12345', value:'{"name":"lee", "phone":"01012341234"}'}, result => {});
*/
exports.updateGID = (data, callback) => {

  var db = connect(err => {
    if (err) throw err;
  });

  db.query(
    'UPDATE ' + TABLE + ' SET value = ? WHERE gid = ?',
    [data.value, data.gid],
    (err, result) => {
      if (err) throw err;


	  if (result.affefctedRows > 0) callback('OK');
	  else callback(result.message);
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
