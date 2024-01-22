import fs from "fs";
import pdf from "pdf-parse";
import { promisify } from "util";
const readFileAsync = promisify(fs.readFile);
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://hjtlrhjfabtavtcdtvuf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqdGxyaGpmYWJ0YXZ0Y2R0dnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMyNTgwNzQsImV4cCI6MjAxODgzNDA3NH0.AO_McXBnZ5ifxBko66NXN4OdWAs8536SS6W4DtpdG2s";

const supabase = createClient(supabaseUrl, supabaseKey);

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: "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", // api key
  dangerouslyAllowBrowser: true, // should be false
});

// change to post instead of handler??
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  console.log("REQ", req.body);

  try {
    // Attempt to parse as form data
    const data = await req.formData();
    const file = data.get("file");
    const file_id = data.get("file_id");

    if (file && file_id) {
      console.log("It is a file with file_id:", file_id);
      // Handle file processing
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const pdfData = await pdf(buffer);

      console.log("PDF text", pdfData.text);
      console.log("file_id", file_id);
      // let filePath = `50b570bd-0f1d-4c00-aeeb-49cb082f89f6/${pdfData.info.Title}`; // HARDCODEDE USERID

      const { chunks } = splitIntoChunks(pdfData.text, file_id);
      const splitData = await processChunks(chunks, file_id);

      console.log("split data....", splitData);

      // console.log(
      //   "RESPONSEE ",
      //   new Response({
      //     message: "PDF processed",
      //     pdfIds: splitData.pdfIds,
      //   })
      // );

      // refactor this to one return
      const responseObject = {
        message: "PDF processed",
        pdfIds: splitData.pdfIds,
        chatId: splitData.chatId,
      };

      const response = new Response(JSON.stringify(responseObject), {
        status: 200, // Set the status code to 200 (OK)
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header to 'application/json'
        },
      });

      return response;
    } else {
      console.log("SHIT AINT A FILE MFF");
    }
  } catch (error) {
    console.error("Error processing form data:", error.message);
    // return res.status(500).json({ error: error });

    // If form data parsing fails, proceed to handle as text input
  }

  // Handle as text input
  try {
    const textData = await req.json(); // Assuming text data if not form data
    console.log("Received text data:", textData);

    // chatCompletion(textData.message);
    console.log("YOOO");
    const answer = await chatMessage(textData.message, textData.pdfId);

    console.log("answer", answer);
    const responseObject = {
      answer: answer,
    };

    const response = new Response(JSON.stringify(responseObject), {
      status: 200, // Set the status code to 200 (OK)
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header to 'application/json'
      },
    });

    return response;
  } catch (innerError) {
    console.error("Error  96:", innerError.message);
    res.status(500).json({ error: innerError.message });
  }
}

// Error Handling in Chunking: Add error handling in the splitIntoChunks function to manage any unexpected scenarios.
function splitIntoChunks(text, file_id, maxChars = 2000) {
  // https://chatgptdetector.co/chatgpt-character-limit/
  let chunks = [];
  let currentChunk = "";

  text.split(/\s+/).forEach((word) => {
    if (currentChunk.length + word.length > maxChars) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk += ` ${word}`;
    }
  });

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // call openapi chat completion here
  // processChunks(chunks); // Reason for my chunk being saved in the db twice
  // console.log("chunks", chunks);

  return { chunks, file_id };
}

// async function chatMessage(text, pdfId) {
//   let answer;
//   console.log("the text that i want to prompt ", text);
//   let pdfTexts;

//   console.log("pdfId", pdfId);
//   try {
//     let { data: pdfs, error } = await supabase
//       .from("pdfs")
//       .select("*")
//       .eq("id", pdfId);

//     if (error) {
//       console.log("Error", error);
//       throw error;
//     }

//     if (pdfs.length === 0) {
//       console.log("No PDF found with the given ID.");
//       return;
//     }

//     // Assuming pdfs is an array of objects and each object has a 'text' property
//     pdfTexts = pdfs.map((pdf) => pdf.text);
//     console.log("PDF text type", typeof pdfTexts[0]);
//     console.log("Number of PDFs", pdfTexts.length);
//   } catch (error) {
//     console.log(error);
//     return;
//   }

//   // Flatten the array of arrays into a single array of strings
//   let flattenedPdfTexts = pdfTexts.flat();

//   let messages = [
//     { role: "system", content: "You are a helpful assistant." },
//     ...flattenedPdfTexts.map((pdfText) => ({ role: "user", content: pdfText })),
//     { role: "user", content: text },
//   ];

//   console.log("messages ", messages);
//   // Add the user's query at the end
//   messages.push({ role: "user", content: text });

//   // Call the OpenAI API
//   let completion;
//   try {
//     completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo-0301",
//       messages: messages,
//     });
//   } catch (error) {
//     console.error("Error calling OpenAI API:", error);
//     return;
//   }

//   if (completion && completion.choices && completion.choices.length > 0) {
//     console.log("GPT Response", completion.choices[0].message.content);
//     answer = completion.choices[0].message.content;
//   } else {
//     console.log("No response from GPT");
//   }
//   return answer;
// }

async function chatCompletion(chunk, text) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: chunk },
      // {
      //   role: "user",
      //   content: text,
      // }, // checker that it got all chunks
    ],
    model: "gpt-3.5-turbo-0301",
  });

  console.log("GPT RESPONSE", completion.choices[0].message.content);

  return completion.choices[0].message.content;
}
async function processChunks(chunks, file_id) {
  console.log("file_id", file_id);
  const pdfText = [];
  const responses = [];
  const pdfIds = [];
  let chatId;

  for (const chunk of chunks) {
    const response = await chatCompletion(chunk);
    responses.push(response);
    pdfText.push(chunk);
  }

  try {
    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .insert([{}]) // Replace with actual data if necessary
      .select();

    if (chatError) {
      console.error("Error inserting chat:", chatError);
      return; // Exit if there's an error
    }

    // console.log("chatData", chatData);

    // Save the chat completion response

    // Database insertion for each chunk

    chatId = chatData[0].id;

    const { data, error } = await supabase
      .from("pdfs")
      .insert([
        {
          text: pdfText,
          userId: "50b570bd-0f1d-4c00-aeeb-49cb082f89f6",
          chatId: chatId,
          file_id: file_id,
        },
      ]) // FIXXX HARDCODED USERID
      .select();

    if (error) {
      throw error;
    }

    // Assuming the response contains the ID of the inserted record
    console.log("Inserted data", data);
    const insertedPdfId = data[0].id;
    pdfIds.push(insertedPdfId);
  } catch (error) {
    console.error("Error in processing chunk: ", error);
  }

  return { pdfIds, chatId };
}

export { handler as POST };
