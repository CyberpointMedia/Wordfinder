const mongoose = require('mongoose');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const fetchPageAndMorePosts = require('../../middleware/fetchPageAndMorePosts');
const Page = require('../../models/pages');
const Appearance = require('../../models/appearance');
const ShowMenu = require('../../models/show-menu');

jest.mock('../../models/pages');
jest.mock('../../models/appearance');
jest.mock('../../models/show-menu');

describe('fetchPageAndMorePosts middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch page and more posts', async () => {
        const mockPage = { title: 'Test Page', status: 'Published' };
        const mockAppearance = [{ customLinks: ['Link 1', 'Link 2'] }];
        const mockMenus = [{ menuName: 'Test Menu', items: [] }];

        Page.findOne.mockResolvedValue(mockPage);
        Appearance.find.mockResolvedValue(mockAppearance);
        ShowMenu.find.mockResolvedValue(mockMenus);

        await fetchPageAndMorePosts(req, res, next);

        expect(Page.findOne).toHaveBeenCalledTimes(1);
        expect(Appearance.find).toHaveBeenCalledTimes(1);
        expect(ShowMenu.find).toHaveBeenCalledTimes(1);

        expect(res.locals.page).toEqual(mockPage);
        expect(res.locals.customLinks).toEqual(mockAppearance[0].customLinks);
        expect(res.locals.menus).toEqual(mockMenus);
        expect(next).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
        const mockError = new Error('Database error');
        Page.findOne.mockRejectedValue(mockError);

        await fetchPageAndMorePosts(req, res, next);

        expect(Page.findOne).toHaveBeenCalledTimes(1);
        expect(Appearance.find).not.toHaveBeenCalled();
        expect(ShowMenu.find).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(mockError);
    });
});
