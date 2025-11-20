# Hirechain

## Introduction

HireChain Decentralized Freelancer Marketplace that is designed to Bridge the financial gaps across Africa by making blockchain technology more accessible. this is our first somewhat major project with hedera :)

## Setup:

### Backend

Visit the backend folder and **strictly** follow the intructions of the README file. and take note of the url e.g http://localhost:3500 (Default)

### Frontend

Take the url the backend is running on. Go to the frontend folder go to next.config.js and the rewrite section should should look like the below

```javascript
 async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3500/:path*" // or <url>/:path*
      }
    ];
  }
```

and you run `npm run dev` and enjoy! you can open http://localhost:3000 on your browser and browse hirechain
