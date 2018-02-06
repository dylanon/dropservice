# dropservice

Node.js backend for a web application that stores messages for one-time access.

## Basic Functionality

- [**Done**] On receipt of a POST request:
  - Validate the data, if necessary
  - Insert message into a collection in a MongoDB data store
  - On success, return the document's ID
  - On error, return an error message
- [**Done**] On receipt of a GET request with a specific ID:
  - Find the document by ID in MongoDB
  - If found:
    - Read the document's contents
    - Delete the document from the database
    - Return the document's contents
  - If not found:
    - Return an error message

## Enhancements

- Encryption at rest
  - For POST requests, encrypt the message before storage (use a secret key stored as an environment variable, or generate a different one for every user?)
  - For GET requests, decrypt the message after reading from the database
- Use HTTPS for all communication
- Delete stored messages after 24 hours
  - Run batch deletion once per day, or
  - Schedule to run exactly 24 hours after creation, for every message
