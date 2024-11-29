const router = require('express').Router();
const ReportService = require('../services/ReportService');

router.post('/generate-daily', async (req, res) => {
  try {
    const { email } = req.body;
    const report = await ReportService.generateDailyReport();
    
    if (email) {
      await ReportService.sendDailyReport(email);
    }
    
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;