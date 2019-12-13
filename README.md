# Kuda Node.js Library

NodeJS wrapper for making secure request to Kuda API

## Getting started

> - paste your private and public key (both in XML format) in your project directory
> - Your client key is the name of your private key file

## Using the library

run `npm install kuda-node`

### Library setup

```js
const fs = require("fs");
const Kuda = require('kuda-node'); 

const publicKey = fs.readFileSync("./kuda.public.xml"); // or path to your kuda public key
const privateKey = fs.readFileSync("./path-to-private-key.xml"); // or path to your kuda kuda private key
const clientKey = "name-of-private-key-file"; // name of private key file without the .xml suffix (extension)

const kuda = Kuda("./index")({
  publicKey,
  privateKey,
  clientKey
}); // this initialize the Kuda function
```

### Making a request

```js
kuda({
  serviceType: "SERVICE_TYPE",
  requestRef: "requestReference",
  data: {
    param: value
  }
});
```

### Sample request

```js
// account creation
const shortid = require("shortid"); // this libarary will generate random id for you. You can install with `yarn add shortid` or `npm i shortid`. You can use any other random key generatring library of your choice

kuda(
  {
    serviceType: "CREATE_VIRTUAL_ACCOUNT",
    requestRef: Math.floor(Math.random() * 1000000000000 + 1), // you can generate your random number your own way. This is just an example.
    data: {
      email: "ajala@obi.com",
      phoneNumber: "08012345678",
      firstName: "Ajala",
      lastName: "Obi",
      trackingReference: "vAcc-" + shortid.generate() // you can generate your trackingReference some other way you choose.
    }
  },
  data => {
    // data => decrypted response from Kuda API
    // do anything with your data
    console.log(JSON.stringify(data, null, 2));
  }
);

// it can also be called with in an async await fashion like so
const onboardUser = async(email, phoneNumber, firstName, lastName, trackingReference) => {
  const response = await kuda({
    serviceType: 'CREATE_VIRTUAL_ACCOUNT',
    requestRef: Number, // like Math.floor(Math.random() * 1000000000000 + 1)
    data: { email, phoneNumber, firstName, lastName, trackingReference }
  })
}
```


> Refer to documentation for respective data types for each fields in the payload

## Contribution & Issues

- Simply **fork the repo**, make changes and **make a pull request**
- You can open an issue for support or suggestions

## Authors

- [Ajala Abdulsamii](https://codementor.io/jalasem)
- [Abdulazeez Murainah](https://github.com/gceezle)
- [Azeez Adio](https://github.com/azeezadio)

# Acknowledgements

- [Kuda Bank Team](https://kudabank.com)
- [Ebidhaa Services Tech Team](https://ebidhaang.org/)
