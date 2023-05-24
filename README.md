# Zammad Ticket Creator
## Description
Zammad is an open-source, web-based help desk and customer support system. It provides a platform for managing and tracking customer inquiries, tickets, and interactions across various communication channels like email, phone, chat, and social media.
Unfortunately there's no [official JavaScript](https://docs.zammad.org/en/latest/api/intro.html) API client. Thus, we've programmed a small adapter to create tickets from our single page applications (e.g. React).

## Usage
```javascript
const ZammadTicketCreator = require("./ZammadTicketCreator");

// use the Url of your Zammad instance
const serverUrl = 'https://your-zammad-instance.com';
// set a fingerprint, a small base64 image, for security reasons
const fingerprint='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASw';
// set a source to let the ticket know where it came from
const source = "Test Form"
// create a new ZammadTicketCreator object and pass the serverUrl, fingerprint and source
const ZammadTicketCreator = new ZammadTicketCreator(serverUrl, fingerprint, source)

// create a new ticket by using the send function. name and email parameter should match 
ZammadTicketCreator.send("Customer Name","test@email.com", {this: "test"})
```

[relivnd](mailto:tobias@teqly.ch) @ [TEQLY](https://teqly.ch/) 2023