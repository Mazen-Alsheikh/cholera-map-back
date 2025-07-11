const db = require("../connect.js");

const getStats = function(req, res) {

  db.query("SELECT * FROM cholera.stats", (error, result) => {
    if (error) return res.status(500).json(error.message);
    if (result.length === 0) return res.status(404).json({message: "لاتوجد بيانات"});
    res.status(200).json({message: "تم جلب البيانات بنجاح", data: result});
  })

}
module.exports = getStats;