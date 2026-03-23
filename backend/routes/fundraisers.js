const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Fundraiser = require('../models/Fundraiser');
const Contribution = require('../models/Contribution');
const { Parser } = require('json2csv');
const { Op } = require('sequelize');

// POST /api/fundraisers — Create a new fundraiser
router.post('/', async (req, res) => {
  try {
    const { giftName, targetAmount, occasion, deadline, description, organizerName, organizerEmail } = req.body;

    // Validate required fields
    if (!giftName || !targetAmount || !occasion || !deadline || !organizerName || !organizerEmail) {
      return res.status(400).json({ error: 'Missing required fields: giftName, targetAmount, occasion, deadline, organizerName, organizerEmail' });
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount < 1) {
      return res.status(400).json({ error: 'targetAmount must be a number greater than 0' });
    }

    const fundraiserId = nanoid(10);

    const fundraiser = await Fundraiser.create({
      fundraiserId,
      giftName: giftName.trim(),
      targetAmount: amount,
      occasion,
      deadline,           // Already YYYY-MM-DD from <input type="date">
      description: description ? description.trim() : '',
      organizerName: organizerName.trim(),
      organizerEmail: organizerEmail.trim().toLowerCase(),
    });

    return res.status(201).json({ success: true, fundraiser });
  } catch (error) {
    console.error('Create fundraiser error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create fundraiser' });
  }
});

// GET /api/fundraisers/:id — Get fundraiser by ID
router.get('/:id', async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findOne({ where: { fundraiserId: req.params.id } });
    if (!fundraiser) return res.status(404).json({ error: 'Fundraiser not found' });

    const contributions = await Contribution.findAll({ where: { fundraiserId: req.params.id } });
    const totalCollected = contributions
      .filter(c => c.confirmed)
      .reduce((sum, c) => sum + c.amount, 0);

    return res.json({ success: true, fundraiser, totalCollected, contributionCount: contributions.length });
  } catch (error) {
    console.error('Get fundraiser error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch fundraiser' });
  }
});

// PUT /api/fundraisers/:id — Update fundraiser details
router.put('/:id', async (req, res) => {
  try {
    const { giftName, targetAmount, occasion, deadline, description } = req.body;

    const fundraiser = await Fundraiser.findOne({ where: { fundraiserId: req.params.id } });
    if (!fundraiser) return res.status(404).json({ error: 'Fundraiser not found' });

    await fundraiser.update({
      giftName: giftName || fundraiser.giftName,
      targetAmount: targetAmount ? parseFloat(targetAmount) : fundraiser.targetAmount,
      occasion: occasion || fundraiser.occasion,
      deadline: deadline || fundraiser.deadline,
      description: description !== undefined ? description : fundraiser.description,
    });

    return res.json({ success: true, fundraiser });
  } catch (error) {
    console.error('Update fundraiser error:', error);
    return res.status(500).json({ error: error.message || 'Failed to update fundraiser' });
  }
});

// PUT /api/fundraisers/:id/close — Close a fundraiser
router.put('/:id/close', async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findOne({ where: { fundraiserId: req.params.id } });
    if (!fundraiser) return res.status(404).json({ error: 'Fundraiser not found' });

    await fundraiser.update({ status: 'closed' });
    return res.json({ success: true, fundraiser });
  } catch (error) {
    console.error('Close fundraiser error:', error);
    return res.status(500).json({ error: error.message || 'Failed to close fundraiser' });
  }
});

// GET /api/fundraisers/:id/export — Export contributions as CSV
router.get('/:id/export', async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findOne({ where: { fundraiserId: req.params.id } });
    if (!fundraiser) return res.status(404).json({ error: 'Fundraiser not found' });

    const contributions = await Contribution.findAll({
      where: { fundraiserId: req.params.id },
      order: [['createdAt', 'DESC']],
    });

    const fields = ['name', 'amount', 'paymentMethod', 'message', 'confirmed', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(contributions.map(c => ({
      name: c.name,
      amount: c.amount,
      paymentMethod: c.paymentMethod,
      message: c.message,
      confirmed: c.confirmed,
      createdAt: c.createdAt,
    })));

    res.header('Content-Type', 'text/csv');
    res.attachment(`contributions-${req.params.id}.csv`);
    return res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    return res.status(500).json({ error: error.message || 'Failed to export CSV' });
  }
});

module.exports = router;
