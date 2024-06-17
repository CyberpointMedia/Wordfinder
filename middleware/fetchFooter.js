const Footer = require('../models/footer'); // Require the Footer model

const fetchFooter = async (req, res, next) => {
    try {
        const footer = await Footer.findOne().populate('footerCol1 footerCol2 footerCol3 footerCol4 footerCol5'); // Fetch the footer data
        if (footer) {
            res.locals.footerCol1 = footer.footerCol1;
            res.locals.footerCol2 = footer.footerCol2;
            res.locals.footerCol3 = footer.footerCol3;
            res.locals.footerCol4 = footer.footerCol4;
            res.locals.footerCol5 = footer.footerCol5;
        }
        next();
    } catch (error) {
        console.error('Error fetching footer:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = fetchFooter;