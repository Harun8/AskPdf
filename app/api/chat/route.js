import fs from "fs";
import pdf from "pdf-parse";
import { promisify } from "util";
const readFileAsync = promisify(fs.readFile);
const { createClient } = require("@supabase/supabase-js");
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"; // defaults to 1000 chars
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY, // api key
  dangerouslyAllowBrowser: true, // should be false
});

// change to post instead of handler??
let file_title;
let userId;
export default async function handler(req, res) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const file_id = data.get("file_id");
    file_title = data.get("file_title");
    userId = data.get("userId");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pdfData = await pdf(buffer);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ["\n\n", "\n", " ", ""], // how it should split and it should prioritise this
      chunkOverlap: 50,
    });

    const output = await splitter.createDocuments([pdfData.text]);

    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: output.pageContent,
      encoding_format: "float",
    });

    console.log(embedding);

    // console.log("output", output);
    const documentsWithForeignKeys = output.map((document) => ({
      ...document,
      user_id: userId, // make sure userId is defined and obtained from your context
      file_id: file_id, // make sure file_id is defined and obtained from your context
    }));

    console.log("each row", documentsWithForeignKeys);

    // Step 2: Insert documents into the Supabase table
    try {
      const { data, error } = await supabase
        .from("documents")
        .insert(documentsWithForeignKeys);

      if (error) throw error;

      console.log("Insertion successful", data);
    } catch (error) {
      console.error("Error inserting documents:", error);
    }

    // const documentsWithForeignKeys = output.map((document) => ({
    //   ...document,
    //   user_id: userId, // Assuming userId is defined elsewhere in your code
    //   file_id: file_id, // Assuming file_id is defined elsewhere in your code
    // }));
    // console.log("each row", documentsWithForeignKeys);

    // await SupabaseVectorStore.fromDocuments(
    //   documentsWithForeignKeys,
    //   new OpenAIEmbeddings({
    //     openAIApiKey: process.env.NEXT_PUBLIC_API_KEY,
    //   }),
    //   {
    //     client: supabase,
    //     tableName: "documents",
    //   }
    // )
    //   .then((data) => {
    //     console.log("Insertion successful", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error inserting documents:", error);
    //   });
    // const responseObject = {
    //   message: "PDF processed",
    // };

    const response = new Response(JSON.stringify(responseObject), {
      status: 200, // Set the status code to 200 (OK)
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header to 'application/json'
      },
    });

    return response;
  } catch (error) {
    const responseObject = {
      message: "PDF failed",
    };

    const response = new Response(JSON.stringify(responseObject), {
      status: 404, // Set the status code to 200 (OK)
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header to 'application/json'
      },
    });

    return response;
  }
}

// // Error Handling in Chunking: Add error handling in the splitIntoChunks function to manage any unexpected scenarios.
// function splitIntoChunks(text, file_id, maxChars = 2000) {
//   // https://chatgptdetector.co/chatgpt-character-limit/
//   let chunks = [];
//   let currentChunk = "";

//   text.split(/\s+/).forEach((word) => {
//     if (currentChunk.length + word.length > maxChars) {
//       chunks.push(currentChunk);
//       currentChunk = word;
//     } else {
//       currentChunk += ` ${word}`;
//     }
//   });

//   if (currentChunk) {
//     chunks.push(currentChunk);
//   }

//   return { chunks, file_id };
// }

// async function chatCompletion(chunk, text) {
//   const completion = await openai.chat.completions.create({
//     messages: [
//       { role: "system", content: "You are a helpful assistant." },
//       { role: "user", content: chunk },
//     ],
//     model: "gpt-3.5-turbo-0301",
//   });

//   // console.log("GPT RESPONSE", completion.choices[0].message.content);

//   return completion.choices[0].message.content;
// }
// async function processChunks(chunks, file_id) {
//   console.log("file_id", file_id);
//   const pdfText = [];
//   const responses = [];
//   const pdfIds = [];
//   let chatId;

//   for (const chunk of chunks) {
//     const response = await chatCompletion(chunk);
//     responses.push(response);
//     pdfText.push(chunk);
//   }

//   try {
//     const { data: chatData, error: chatError } = await supabase
//       .from("chats")
//       .insert([{}]) // Replace with actual data if necessary
//       .select();

//     if (chatError) {
//       console.error("Error inserting chat:", chatError);
//       return; // Exit if there's an error
//     }

//     // console.log("chatData", chatData);

//     // Save the chat completion response

//     // Database insertion for each chunk

//     chatId = chatData[0].id;

//     const { data, error } = await supabase
//       .from("pdfs")
//       .insert([
//         {
//           text: pdfText,
//           userId: userId,
//           chatId: chatId,
//           file_id: file_id,
//           pdf_title: file_title,
//         },
//       ]) // FIXXX HARDCODED USERID
//       .select();

//     if (error) {
//       throw error;
//     }

//     // Assuming the response contains the ID of the inserted record
//     // console.log("Inserted data", data);
//     const insertedPdfId = data[0].id;
//     pdfIds.push(insertedPdfId);
//   } catch (error) {
//     console.error("Error in processing chunk: ", error);
//   }

//   return { pdfIds, chatId };
// }

export { handler as POST };
