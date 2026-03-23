const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const Fundraiser = require('../models/Fundraiser');

// POST /api/contributions — Add a contribution
router.post('/', async (req, res) => {
  try {
    const { fundraiserId, name, amount, message, paymentMethod } = req.body;

    if (!fundraiserId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields: fundraiserId, amount, paymentMethod' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({ error: 'amount must be a number greater than 0' });
    }

    // Check fundraiser exists and is open
    const fundraiser = await Fundraiser.findOne({ where: { fundraiserId } });
    if (!fundraiser) return res.status(404).json({ error: 'Fundraiser not found' });
    if (fundraiser.status === 'closed') return res.status(400).json({ error: 'Fundraiser is closed' });

    const contribution = await Contribution.create({
      fundraiserId,
      name: name ? name.trim() : 'Anonymous',
      amount: parsedAmount,
      message: message ? message.trim() : '',
      paymentMethod,
      // Cash requires manual confirmation; UPI and Card are auto-confirmed (simulated)
      confirmed: paymentMethod !== 'cash',
    });

    return res.status(201).json({ success: true, contribution });
  } catch (error) {
    console.error('Add contribution error:', error);
    return res.status(500).json({ error: error.message || 'Failed to add contribution' });
  }
});

// GET /api/contributions/:fundraiserId — Get all contributions for a fundraiser
router.get('/:fundraiserId', async (req, res) => {
  try {
    const contributions = await Contribution.findAll({
      where: { fundraiserId: req.params.fundraiserId },
      order: [['createdAt', 'DESC']],
    });

    const totalCollected = contributions
      .filter(c => c.confirmed)
      .reduce((sum, c) => sum + c.amount, 0);

    return res.json({ success: true, contributions, totalCollected });
  } catch (error) {
    console.error('Get contributions error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch contributions' });
  }
});

// PUT /api/contributions/:id/confirm — Mark contribution as received (organizer)
router.put('/:id/confirm', async (req, res) => {
  try {
    const contribution = await Contribution.findByPk(req.params.id);
    if (!contribution) return res.status(404).json({ error: 'Contribution not found' });

    await contribution.update({ confirmed: true });
    return res.json({ success: true, contribution });
  } catch (error) {
    console.error('Confirm contribution error:', error);
    return res.status(500).json({ error: error.message || 'Failed to confirm contribution' });
  }
});

// DELETE /api/contributions/:id — Delete a contribution (organizer)
router.delete('/:id', async (req, res) => {
  try {
    const contribution = await Contribution.findByPk(req.params.id);
    if (!contribution) return res.status(404).json({ error: 'Contribution not found' });

    await contribution.destroy();
    return res.json({ success: true, message: 'Contribution deleted' });
  } catch (error) {
    console.error('Delete contribution error:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete contribution' });
  }
});

module.exports = router;
