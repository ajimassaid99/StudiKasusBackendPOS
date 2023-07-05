const { subject } = require('@casl/ability');
const Invoice = require('../invoice/model');
const { policyFor } = require('../../utils/index');

const show = async (req, res, next) => {
  try {
    let { order_id } = req.params;
    let invoice = await Invoice.findOne({ order: order_id }).populate('order').populate('user');

    if (!invoice) {
      return res.json({
        error: 1,
        message: 'Invoice tidak ditemukan',
      });
    }

    let policy = policyFor(req.user);
    let subjectInvoice = subject('Invoice', { ...invoice, user_id: invoice.user._id });

    if (!policy.can('read', subjectInvoice)) {
      return res.json({
        error: 1,
        message: 'Anda tidak dapat melihat invoice',
      });
    }

    return res.json(invoice);
  } catch (e) {
    return res.json({
      error: 1,
      message: 'Error ketika mengambil data invoice',
    });
  }
};

module.exports = {
  show,
};
