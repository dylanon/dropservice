// Set environment variables for local development without Heroku CLI
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const request = require('supertest');
const express = require('express');
const MongoClient = require('mongodb');

const app = express();
const defineRoutes = require('./index');

beforeAll(() => {
    let collection;
    return MongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
        collection = client.db(process.env.MONGODB_NAME).collection('drops');
        defineRoutes(app, collection);
    })
    .catch(error => {
        console.log('Could not connect to MongoDB. ' + error.message);
    });
});

describe('test root route', () => {
    it('should respond with "Rooting for you!"', () => {
        return request(app)
        .get('/')
        .then(res => {
            expect(res.text).toBe('Rooting for you!');
        });
    });
});

describe('test creation of a document', () => {
    let createdId;

    afterAll(() => {
        return request(app)
        .get(`/retrieve/${createdId}`)
        .then(res => {
            console.log('Cleaned up test document created with id ' + res.body.deletedId);
        })
        .catch(err => {
            console.log('Cleanup failed.');
            console.log(err);
        });
    });

    it('should say that write succeeded and return a valid id when a proper message is POSTed', () => {
        return request(app)
        .post('/drop')
        // Sends JSON by default
        .send({
            message: 'A test message'
        })
        .then(res => {
            createdId = res.body.id;
            expect(res.body.writeSucceeded).toBe(true);
            expect(res.body.id.length).toBe(24);
        });
    });
    
    it('should say that write did not succeed when the message property is missing from a POST', () => {
        return request(app)
        .post('/drop')
        // Sends JSON by default
        .send({
            notMessage: 'A test message'
        })
        .then(res => {
            expect(res.body.writeSucceeded).toBe(false);
            expect(res.body.id).toBe(undefined);
        })
    });
});

describe('test find and delete of a document', () => {
    let documentId;
    beforeAll(() => {
        return request(app)
        .post('/drop')
        // Sends JSON by default
        .send({
            message: 'A test message'
        })
        .then(res => {
            documentId = res.body.id;
        })
        .catch(err => {
            console.log('Setup failed.');
            console.log(err);
        });
    });

    it('should respond with a valid id when a document is accessed', () => {
        return request(app)
        .get(`/retrieve/${documentId}`)
        .then(res => {
            expect(res.body.deletedId).toBe(documentId);
        })
    });

    it('should respond with null data when the requested id is too short', () => {
        return request(app)
        .get('/retrieve/1')
        .then(res => {
            expect(res.body.deletedId).toBe(null);
            expect(res.body.message).toBe(null);
        })
    });
    
    it('should respond with null data when the requested id is too long', () => {
        return request(app)
        .get('/retrieve/123456789123456789123456789')
        .then(res => {
            expect(res.body.deletedId).toBe(null);
            expect(res.body.message).toBe(null);
        })
    });
    
    it('should respond with null data when the requested id is not found', () => {
        return request(app)
        .get('/retrieve/111111111111111111111111')
        .then(res => {
            expect(res.body.deletedId).toBe(null);
            expect(res.body.message).toBe(null);
        });
    });
});