// test/fetchPageAndMorePosts.test.js

const request = require('supertest');
const express = require('express');
const fetchPageAndMorePosts = require('../../middleware/fetchPageAndMorePosts');
const Post = require('../../models/post');
const Page = require('../../models/pages');
const Appearance = require('../../models/appearance');
const ShowMenu = require('../../models/show-menu');

jest.mock('../../models/post');
jest.mock('../../models/pages');
jest.mock('../../models/appearance');
jest.mock('../../models/show-menu', () => {
    return {
        find: jest.fn().mockResolvedValue(['menu']),
    };
});

describe('fetchPageAndMorePosts', () => {
    it('should fetch posts, page, appearance, and menus', async () => {
        const mockReq = {};
        const mockRes = { locals: {}, status: jest.fn().mockReturnThis(), send: jest.fn() };
        const mockNext = jest.fn();

        Post.find.mockResolvedValue(['post1', 'post2', 'post3']);
        Page.findOne.mockResolvedValue('page');
        Appearance.find.mockResolvedValue(['appearance']);
        ShowMenu.find.mockResolvedValue(['menu']);

        await fetchPageAndMorePosts(mockReq, mockRes, mockNext);

        expect(mockRes.locals.morePosts).toEqual(['post1', 'post2', 'post3']);
        expect(mockRes.locals.page).toEqual('page');
        expect(mockRes.locals.menus).toEqual(['menu']);
        expect(mockRes.locals.customLinks).toEqual(['appearance']);
        expect(mockNext).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
        const mockError = new Error('Test error');
        Post.find.mockRejectedValue(mockError);

        const mockReq = {};
        const mockRes = { locals: {} };
        const mockNext = jest.fn();

        await fetchPageAndMorePosts(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(mockError);
    });
});