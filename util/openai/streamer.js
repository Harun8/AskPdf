"use server";
import { ChatOpenAI } from "@langchain/openai";
import { modelChooser } from "@/util/openai/modelChooser";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import combineDocuments from "@/util/combineDocuments";
import formatConvHistory from "@/util/formatConvHistory";
const OpenAI = require("openai");
const { createClient } = require("@supabase/supabase-js");
import { emitter } from "@/util/openai/emit";

const standAloneQuestionTemplate = `Given some conversation history (if any) and a question, convert it into a standalone question. 
conversation history: {conv_history}

question: {question} 
standalone question:`;

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standAloneQuestionTemplate
);

const answerTemplate = `You're a helpful and enthusiastic suppport bot who can answer a given question about the context provided,
and the conversation history. 
 Try to find the answer in the context.
 Do not try to make up an answer. Always speak as if you were chatting to a friend.
 context: {context}
 conversation history: {conv_history}
 question: {question}
 answer:
  `;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // api key
});
// const Streamer = async (plan, messageText, conv_history, file_id) => {
//   console.log(plan, messageText, conv_history, file_id);
//   try {
//     const llm = new ChatOpenAI({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       modelName: modelChooser(plan),
//       streaming: true,
//       //  temperature: 0.5
//     });

//     // console.log("min LLM ER:", llm);

//     const standaloneQuestionchain = standaloneQuestionPrompt
//       .pipe(llm)
//       .pipe(new StringOutputParser());

//     const retrieverChain = RunnableSequence.from([
//       (prevResult) => prevResult.standalone_question,
//       (prevResult) => retriver(prevResult, file_id),
//       combineDocuments,
//     ]);

//     const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

//     const chain = RunnableSequence.from([
//       {
//         standalone_question: standaloneQuestionchain,
//         original_input: new RunnablePassthrough(),
//       },
//       {
//         context: retrieverChain,
//         question: ({ original_input }) => original_input.question,
//         conv_history: ({ original_input }) => original_input.conv_history,
//       },
//       answerChain,
//     ]);

//     const response = await chain.stream({
//       question: messageText,
//       conv_history: await formatConvHistory(conv_history),
//     });
//     // console.log("response", response);
//     for await (const chunk of response) {
//       console.log(`${chunk}|`);
//       //   console.log("chunk", chunk);
//       // return chunk;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// export default Streamer;

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

export default async function retriver(queryText, file_id) {
  //   console.log("file_id", file_id);

  const model = "text-embedding-3-small";
  //   console.log("queryText", queryText);
  // Generate the embedding vector for the query text
  let queryEmbedding;
  try {
    const embeddingResult = await openai.embeddings.create({
      model: model,
      input: queryText,
    });
    if (embeddingResult.error) {
      console.error("Error generating embeddings:", embeddingResult.error);
      return [];
    }
    // console.log("embeddingResult", embeddingResult);
    queryEmbedding = embeddingResult.data[0].embedding; // Adjust this line based on the actual structure of the response
  } catch (error) {
    console.error("Error during embedding generation:", error);
    return [];
  }
  // Now use the generated embedding as query_embedding in the RPC call
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding, // Use the generated embedding here
    file_id: file_id,
    match_count: 10,
    filter: {},
  });

  //   console.log("data", data);

  if (error) {
    console.error("Error searching for documents:", error);
    return [];
  }

  return data || [];
}
