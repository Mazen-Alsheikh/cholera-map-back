const db = require("../connect");

exports.getStates = (req, res) => {
  
  db.query("SELECT * FROM railway.stats", (error, result) => {
    if (error) return res.status(500).json(error.message);
    if (result.length === 0) return res.status(404).json({message: "لاتوجد بيانات"});
    res.status(200).json({message: "تم جلب البيانات بنجاح", data: result});
  })

}

exports.updateState = (req, res) => {
  const state = req.body.state;
  const cases = parseInt(req.body.cases) || 0;
  const deaths = parseInt(req.body.deaths) || 0;
  const recovered = parseInt(req.body.recovered) || 0;
  const totalCases = cases + parseInt(req.body.totalCases);
  const totalDeaths = deaths + parseInt(req.body.totalDeaths);
  const totalRecovered = recovered + parseInt(req.body.totalRecovered);

  console.log(state, cases, deaths, recovered, totalCases, totalDeaths, totalRecovered);

  db.query("SELECT * FROM railway.stats WHERE state = ?", [state], (error, result) => {
    if (error) return res.status(500).json({ error: error, message: "خطأ في قاعدة البيانات" });
    if (result.length === 0) return res.status(404).json({ message: "الولاية غير موجودة، لم يتم تحديث البيانات" });

    db.query(
      "UPDATE railway.stats SET cases = ?, recovered = ?, deaths = ?, total_cases = ?, total_deaths = ?, total_recovered = ? WHERE state = ?",
      [cases, recovered, deaths, totalCases, totalDeaths, totalRecovered, state],
      (error, result) => {
        if (error) return res.status(500).json({ error: error, message: "خطأ في قاعدة البيانات" });
        console.log("here");
        if (result.affectedRows === 0) return res.status(404).json({ message: "الولاية غير موجودة، لم يتم تحديث البيانات" });
        return res.status(200).json({ message: "تم تحديث البيانات بنجاح" });
      }
    );
  });
}