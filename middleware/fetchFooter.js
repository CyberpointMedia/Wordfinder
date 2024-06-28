const Footer = require('../models/footer'); // Require the Footer model

const fetchFooter = async (req, res, next) => {
    try {
        console.log('Fetching footer data...');
        const footer = await Footer.findOne().populate('footerCol1 footerCol2 footerCol3 footerCol4 footerCol5'); // Fetch the footer data
        if (footer) {
            res.locals.footer = footer;
            console.log('Footer data:', footer);
        } else {
            res.locals.footer = {};
            console.log('No footer data found, setting to empty object.');
        }
        next();
    } catch (error) {
        console.error('Error fetching footer:', error);
        res.locals.footer = {}; // Set an empty object if there's an error
        next(); // Ensure the request continues to the next middleware or route
    }
};

module.exports = fetchFooter;
