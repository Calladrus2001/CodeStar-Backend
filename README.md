
# Code:Star Backend

This is the Node.js backend for my **Flutter** App.


## Tech Stack

**Server:** Node.js, Express.js 

**Database:** MongoDB

**APIs:** Hedera Web3 Javascript SDK

**Client:** [Link to Client App Repo](https://github.com/Calladrus2001/Code-Star)



## Installation

Clone the repo and run `npm i` to install the dependencies.

As of now, the project isn't deployed so to access the APIs from a public url use **ngrok**. Download  from [here](https://ngrok.com/download).

You would also need to setup your **Hedera** Testnet credentials, checkout the next section for more info.
## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file
```
HEDERA_PVT_KEY="YOUR_PRIVATE_KEY"
HEDERA_PUB_KEY="YOUR_PUBLIC_KEY"
HEDERA_ACC_ID="YOUR_ACCOUNT_ID"
HEDERA_newCID = "0.0.CONTRACT_ID"
```
Furtheremore, uncomment `line 54` in `/hedera/contract.js` to initialise the Smart contract, you would get the *new Contract ID* in console logs, put that value in `HEDERA_newCID` in your `.env` file. Comment `line 54` again.
## API Reference

Checkout my Postman API collection below:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/20360721-600d6471-c4b1-43ed-8d24-44f2b5beac4a?action=collection%2Ffork&collection-url=entityId%3D20360721-600d6471-c4b1-43ed-8d24-44f2b5beac4a%26entityType%3Dcollection%26workspaceId%3Db2c849e2-484f-4dcd-bbe6-daf758f94b9b)

## Future Roadmap

 - State Management (Client)
 - AWS Deployement
 - Wynk Music Player-like animations
 - Social Functionalities
 - Dyslexia-friendly Games


## Acknowledgements
This is a list of resources that helped me immensely while making this project.

 - [Andrew Mead's Udemy Course]()
 - [Hedera's Javascript Tutorial Playlist](https://www.youtube.com/playlist?list=PLcaTa5RR9SuA__8rzCKru8Y_F6iMJPEUD)
