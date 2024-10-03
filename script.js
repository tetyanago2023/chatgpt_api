// import { config } from "dotenv"
// config()
//
// import { Configuration, OpenAIApi } from "openai"
//
// const openAi = new OpenAIApi(
//     new Configuration({
//         apiKey: process.env.API_KEY,
//     })
// )
//
// // Exponential backoff function
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//
// const retryWithExponentialBackoff = async (fn, retries = 5) => {
//     for (let i = 0; i < retries; i++) {
//         try {
//             return await fn(); // Attempt to call the function
//         } catch (error) {
//             if (error.response?.status === 429) {
//                 const waitTime = Math.pow(2, i + 1) * 1000; // Exponential backoff (2^(i+1) seconds)
//                 console.log(`Rate limit hit. Retrying in ${waitTime / 1000} seconds...`);
//                 await delay(waitTime); // Wait before retrying
//             } else {
//                 throw error; // Re-throw error if it's not a 429
//             }
//         }
//     }
//     throw new Error('Max retries reached'); // If all retries are exhausted
// }
//
// // Function to call the OpenAI API with an added delay before execution
// const getCompletion = async () => {
//     await delay(3000); // Fixed delay of 3 seconds before the API call
//     return openAi.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: "Hello, ChatGPT." }],
//         max_tokens: 50 // Limit token usage
//     })
// }
//
// // Use the retry function to call the OpenAI API
// retryWithExponentialBackoff(getCompletion)
//     .then(response => {
//         console.log(response.data.choices[0].message.content);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

//
// // Use the retry function to call the OpenAI API
// retryWithExponentialBackoff(getCompletion)
//     .then(response => {
//         console.log(response.data.choices[0].message.content);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

// import { config } from "dotenv";
// config();
//
// import { Configuration, OpenAIApi } from "openai";
//
// const openAi = new OpenAIApi(
//     new Configuration({
//         apiKey: process.env.API_KEY,
//     })
// );
//
// // Exponential backoff function
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//
// const retryWithExponentialBackoff = async (fn, retries = 5) => {
//     for (let i = 0; i < retries; i++) {
//         try {
//             return await fn(); // Attempt to call the function
//         } catch (error) {
//             if (error.response?.status === 429) {
//                 const waitTime = Math.pow(2, i + 1) * 1000; // Exponential backoff
//                 console.log(`Rate limit hit. Retrying in ${waitTime / 1000} seconds...`);
//                 await delay(waitTime); // Wait before retrying
//             } else {
//                 throw error; // Re-throw error if it's not a 429
//             }
//         }
//     }
//     throw new Error('Max retries reached'); // If all retries are exhausted
// }
//
// // Function to call the OpenAI API with the new chat completions endpoint
// const getCompletion = async () => {
//     await delay(3000); // Fixed delay of 3 seconds before the API call
//     return openAi.createChatCompletion({
//         model: "gpt-3.5-turbo", // Change the model to gpt-3.5-turbo
//         messages: [{ role: "user", content: "Hello, ChatGPT." }], // Adjusted message format
//         max_tokens: 50 // Limit token usage
//     });
// }
//
// // Use the retry function to call the OpenAI API
// retryWithExponentialBackoff(getCompletion)
//     .then(response => {
//         console.log(response.data.choices[0].message.content); // Adjusted to access the response correctly
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

// import { Configuration, OpenAIApi } from "openai";
// import { config } from "dotenv";
// import PQueue from 'p-queue'; // Importing p-queue
//
// config();
//
// const openAi = new OpenAIApi(new Configuration({ apiKey: process.env.API_KEY }));
//
// // Create a queue with concurrency limit
// const queue = new PQueue({ concurrency: 1 }); // Change concurrency based on your rate limits
//
// // Function to call the OpenAI API
// const getCompletion = async () => {
//     return openAi.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: "Hello, ChatGPT." }],
//         max_tokens: 50
//     });
// };
//
// // Wrapper to handle retries
// const retryWithExponentialBackoff = async (fn, retries = 5) => {
//     for (let i = 0; i < retries; i++) {
//         try {
//             return await fn();
//         } catch (error) {
//             if (error.response?.status === 429) {
//                 const waitTime = Math.pow(2, i + 1) * 1000;
//                 console.log(`Rate limit hit. Retrying in ${waitTime / 1000} seconds...`);
//                 await delay(waitTime);
//             } else {
//                 throw error;
//             }
//         }
//     }
//     throw new Error('Max retries reached');
// };
//
// // Adding the API call to the queue
// queue.add(() => retryWithExponentialBackoff(getCompletion))
//     .then(response => {
//         console.log(response.data.choices[0].message.content);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
//
// // Delay function for handling wait times
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";
import PQueue from 'p-queue'; // Make sure p-queue is installed

config();

const openAi = new OpenAIApi(new Configuration({ apiKey: process.env.API_KEY }));

// Create a queue with concurrency limit
const queue = new PQueue({ concurrency: 1 });

// Function to call the OpenAI API
const getCompletion = async () => {
    return openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello, ChatGPT." }],
        max_tokens: 50
    });
};

// Wrapper to handle retries
const retryWithExponentialBackoff = async (fn, retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.response?.status === 429) {
                const waitTime = Math.pow(2, i + 1) * 1000;
                console.log(`Rate limit hit. Retrying in ${waitTime / 1000} seconds...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }
    throw new Error('Max retries reached');
};

// Adding the API call to the queue
queue.add(() => retryWithExponentialBackoff(getCompletion))
    .then(response => {
        console.log(response.data.choices[0].message.content);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Delay function for handling wait times
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
