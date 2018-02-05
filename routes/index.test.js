const request = require('supertest');
const express = require('express');

const app = express();
const defineRoutes = require('./index');

defineRoutes(app, null);

it('should respond with "Rooting for you!"', () => {
    return request(app)
    .get('/')
    .then(res => {
        expect(res.text).toBe('Rooting for you!');
    });
});