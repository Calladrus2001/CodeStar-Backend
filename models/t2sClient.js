// Imports the Google Cloud client library
const textToSpeech = require("@google-cloud/text-to-speech");

// Creates a client
const t2sclient = new textToSpeech.TextToSpeechClient();

module.exports = t2sclient;