import Axios from "axios";
import mysql from "mysql";

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "piyush@99",
  database: "test_piyush",
});

const getTodayCovidData = async () => {
  try {
    const todayData = await Axios.get(
      "https://www.mohfw.gov.in/data/datanew.json"
    );

    const valuesArr = [];
    todayData.data.forEach((element, index) => {
      const arr = [];
      arr.push(parseInt(element.new_cured));
      arr.push(parseInt(element.new_cured - element.cured));
      arr.push(new Date());
      if (element.sno === "11111") {
        arr.push("India");
      } else {
        arr.push(element.state_name);
      }

      arr.push(parseInt(element.new_active));
      arr.push(parseInt(element.new_active - element.active));
      arr.push(parseInt(element.new_death));
      arr.push(parseInt(element.new_death - element.death));

      valuesArr.push(arr);
    });

    var sql =
      "INSERT INTO state_wise_data (cured_cases,cured_cases_change,data_date,state_name,total_cases,total_cases_change,total_death,total_death_change) VALUES ?";

    conn.query(sql, [valuesArr], function (err) {
      if (err) throw err;
      console.log("Data Saved SuccessFully");
      conn.end();
    });
  } catch (error) {
    console.log(error);
  }
};

export default getTodayCovidData;

/*

Table and Data Format


  `cured_cases` bigint(20) DEFAULT NULL,
  `cured_cases_change` bigint(20) DEFAULT NULL,
  `data_date` datetime(6) DEFAULT NULL,
  `state_name` varchar(255) DEFAULT NULL,
  `total_cases` bigint(20) DEFAULT NULL,
  `total_cases_change` bigint(20) DEFAULT NULL,
  `total_death` bigint(20) DEFAULT NULL,
  `total_death_change` bigint(20) DEFAULT NULL
(cured_cases,cured_cases_change,data_date,state_name,total_cases,total_cases_change,total_death,total_death_change)

  {
  sno: '37',
  state_name: 'West Bengal',
  active: '110241',
  positive: '810955',
  cured: '689466',
  death: '11248',
  new_active: '113624',
  new_positive: '828366',
  new_cured: '703398',
  new_death: '11344',
  state_code: '19'
}


  */
