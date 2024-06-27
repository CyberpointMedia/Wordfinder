const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Footer = require('../models/footer');
const fetchFooter = require('./fetchFooter');

jest.mock('../../models/footer');

const app = express();
app.use(fetchFooter);

app.get('/', (req, res) => {
    res.status(200).send(res.locals.footer ? res.locals.footer : 'No footer data');
});

describe('fetchFooter Middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch footer data successfully', async () => {
        const mockFooter = {
            footerCol1: ['col1data'],
            footerCol2: ['col2data'],
            footerCol3: ['col3data'],
            footerCol4: ['col4data'],
            footerCol5: ['col5data'],
        };

        Footer.findOne.mockResolvedValue({
            populate: jest.fn().mockResolvedValue(mockFooter)
        });

        const response = await request(app).get('/');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockFooter);
        expect(Footer.findOne).toHaveBeenCalledTimes(1);
    });

    test('should handle no footer data', async () => {
        Footer.findOne.mockResolvedValue(null);

        const response = await request(app).get('/');
        
        expect(response.status).toBe(200);
        expect(response.text).toBe('No footer data');
        expect(Footer.findOne).toHaveBeenCalledTimes(1);
    });

    test('should handle errors during fetching footer data', async () => {
        Footer.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/');
        
        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
        expect(Footer.findOne).toHaveBeenCalledTimes(1);
    });
});
