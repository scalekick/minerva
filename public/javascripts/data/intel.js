var pg = require('pg');
//var connectionString = 'postgres://localhost:5432/minera-prod';
var connectionString = process.env.DATABASE_URL;

module.exports.getPricing = function(mode, category, year, month, yearEnd, monthEnd, callback) {
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      if (err) return callback(err);
    }
    //console.log(mode + '|' + category + '|' + year + '|' + month + '|' + yearEnd + '|' + monthEnd )
    var query;

    switch (mode) {
      case 'month':
        query = client.query('select * from pricing where category=$1 and year=$2 and month=$3 order by range_start;',
        [category, year, month]);
        break;
      case 'year':
        query = client.query('select max(year) as year, \'Whole year\' as month, range_start, range_end, sum(sales) as sales, sum(orders) as orders, sum(products) as products from pricing where category=$1 and year=$2 group by range_start, range_end order by range_start;',
        [category, year]);
        break;
      case 'range':
        query = client.query('select * from pricing where category=$1 and year=$2 and (month>=$3 and month<=$4) order by year, month, range_start;',
        [category, year, month, monthEnd]);
        break;
      case 'sum':
        query = client.query('select range_start, range_end, sum(sales) as sales, sum(orders) as orders, sum(products) as products from pricing where category=$1 and year=$2 and (month>=$3 and month<=$4) group by range_start, range_end order by range_start;',
        [category, year, month, monthEnd]);
        break;
    }

    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      callback(null, results);
    });
  });
}

module.exports.getAttr = function(mode, category, year, month, yearEnd, monthEnd, callback)
{
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      if (err) return callback(err);
    }

    var query;

    switch (mode) {
      case 'month':
        query = client.query('select * from location where category=$1 and year=$2 and month=$3 order by orders desc;',
        [category, year, month]);
        break;
      case 'year':
        query = client.query('select max(year) as year, \'Whole year\' as month, location, sum(sales) as sales_index, sum(orders) as orders, sum(products) as products from location where category=$1 and year=$2 group by location order by orders desc;',
        [category, year]);
        break;
      case 'range':
        query = client.query('select * from location where category=$1 and year=$2 and (month>=$3 and month<=$4) order by year, month, orders desc;',
        [category, year, month, monthEnd]);
        break;
      case 'sum':
        query = client.query('select location, sum(sales) as sales_index, sum(orders) as orders, sum(products) as products from location where category=$1 and year=$2 and (month>=$3 and month<=$4) group by location order by orders desc;',
        [category, year, month, monthEnd]);
        break;
    }

    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      callback(null, results);
    });
  });
}

module.exports.getSales = function(mode, category, year, month, yearEnd, monthEnd, callback)
{
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      if (err) return callback(err);
      //return res.status(500).json({success: false, data: err});
    }

    var query = client.query('select year, month, sum(sales)::integer as sales, sum(orders)::integer as orders, sum(products)::integer as products from location where category=$1 and (year>=$2 and year<=$3) and (month>=$4 and month<=$5) group by (year, month) order by year, month;',
    [category, year, yearEnd, month, monthEnd]);

    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      callback(null, results);
      //return res.json(results);
    });
  });
}


module.exports.getOverview = function(mode, category, startDate, endDate, callback)
{
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      if (err) return callback(err);
      //return res.status(500).json({success: false, data: err});
    }

    var query = client.query('select date, sum(sales_index)::integer as sales_index, sum(orders)::integer as orders, sum(products)::integer as products from overview where category=$1 and (date>=$2 and date<=$3) group by date order by date;',
    [category, startDate, endDate]);

    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      callback(null, results);
    });
  });
}
