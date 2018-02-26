# dropservice

Node.js REST API that stores messages for one-time access within 24 hours. [Service is live here.](http://mighty-everglades-39422.herokuapp.com/)

*This is an experimental project - Use at your own risk!*

## Endpoints

### **POST** `/drop`

*Makes a drop - A message that is encrypted and stored for approximately 24 hours, and self-destructs upon retrieval (can only be retrieved once).*

Set the body of your request to a JSON object with a single key/value pair. The key must be `message`.

Example:

```javascript
fetch('http://mighty-everglades-39422.herokuapp.com/drop', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        message: 'Hello, world!'
    })
})
.then(res => res.json();)
.then(data => {
  // Log the response to the console
  console.log(data);
});
```

#### Sample responses (`/drop`)

```javascript
// Successful request
{
  details: "Write to database succeeded!",
  id: "5a93744897320d091c044a26",
  writeSucceeded: true
}
```

```javascript
// Failed request
{
  details: "Invalid request - Define the 'message' property in your request!",
  writeSucceeded: false
}
```

### **GET** `/retrieve/:id`

*Retrieves a drop and deletes it permanently from storage. Its message is decrypted and sent back in the response. The drop cannot be retrieved again.*

Set the ID of the drop you would like retrieve as a *route parameter* in your GET request.

```javascript
  fetch('http://mighty-everglades-39422.herokuapp.com/retrieve/5a93744897320d091c044a26')
  .then(res => res.json())
  .then(data => {
    // Do something with the data
    console.log(data)
  });
```

#### Sample responses (`/retrieve/:id`)

```javascript
// Successful request
{
  deletedId: "5a93744897320d091c044a26",
  details: "Deleted document with id 5a93744897320d091c044a26.",
  message: "This is the text of a message someone dropped."
}
```

```javascript
// Failed request
{
  deletedId: null,
  details: "Could not find document with id 5a93744897320d091c044a26. Nothing deleted.",
  message: null
}
```

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

- [**Done**] Encryption at rest
  - For POST requests, encrypt the message before storage
  - For GET requests, decrypt the message after reading/deleting from the database
- Use HTTPS for all communication
- [**Done**] Delete stored messages after 24 hours
  - Run batch deletion once per day, or
  - Schedule to run exactly 24 hours after creation, for every message
