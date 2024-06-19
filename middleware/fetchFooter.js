const Footer = require('../models/footer'); // Require the Footer model

const fetchFooter = async (req, res, next) => {
    try {
        const footer = await Footer.findOne().populate('footerCol1 footerCol2 footerCol3 footerCol4 footerCol5'); // Fetch the footer data
        if (footer) {
            res.locals.footer = footer; // Make the footer data available to all EJS templates
        }
        console.log('Footer data fetched successfully');
        //console.log('Footer data:', footer);
        next();
    } catch (error) {
        console.error('Error fetching footer:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = fetchFooter;