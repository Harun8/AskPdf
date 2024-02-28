"use client";

import { Document, Page } from "react-pdf";
// import pdf from ".../public/pdf";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
import React, { Fragment, useState, useEffect } from "react";
import "@/public/styles/chat.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import TextField from "@/components/TextField";
import ConversationDisplay from "@/components/ConversationDisplay";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect, useRouter } from "next/navigation";

import Modal from "@/components/Modal";

import { toast } from "sonner";

import { fileSizeLimit } from "@/util/fileSizeLimit";
import { uploadLimit } from "@/util/uploadLimit";

const supabase = createClientComponentClient();

export default function chat() {
  const [conversation, setConversation] = useState([]);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPdf] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPdfId, setCurrentPdfId] = useState(null);
  const [chatId, setChatId] = useState("");
  const [userId, setUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTextDisabled, setIsTextDisabled] = useState(true);
  const [duplicateFileError, setDuplicateFileError] = useState(false);
  const [plan, setPlan] = useState(null);
  const [fileOverLimit, setFileOverLimit] = useState(false);
  const [uploadCount, setUploadCount] = useState(null);
  const [isOverPDFCount, setIsOverPDFCount] = useState(false);
  const [showThinkingAnimation, setShowThinkingAnimation] = useState(false);

  const router = useRouter();
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    const getAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        // console.log("session", session);

        if (session) {
          setUserId(session.user.id);
          setIsAuthenticated(true);
          const response = await fetch("/api/abilities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Specify the content type as JSON
            },
            body: JSON.stringify({
              user_id: session.user.id,
            }),
          });

          if (!response.ok) {
            console.log("Could not fetch abilities");
          }

          const data = await response.json();
          console.log("data with plan", data);
          setPlan(data.fileSize);
          setUploadCount(data.upload);
        } else {
          router.push("/");
          console.log("THE USER AINT AUTHENTICATED REDIRRRREEECCCTT MFFF");
        }
      } catch (error) {
        console.error("Error checking authentication", error);
        // Handle error as appropriate
      }
    };

    getAuth();
  }, []);

  useEffect(() => {
    console.log("convo", conversation);
  }, [conversation]);

  const convHistory = [];

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    const newMessage = { type: "user", text: messageText };
    setConversation([...conversation, newMessage]);
    convHistory.push(messageText);

    try {
      setShowThinkingAnimation(true);
      const response = await fetch("/api/llm", {
        method: "POST",
        body: JSON.stringify({
          plan: plan,
          messageText: messageText,
          conv_history: convHistory,
          file_id: currentPdfId,
        }),
      });

      const data = await response.json();

      if (data) {
        setShowThinkingAnimation(false);

        const chatbotResponse = {
          type: "response",
          text: data,
        };
        // Adding chatbot response to the conversation
        setConversation((conversation) => [...conversation, chatbotResponse]);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const onFileSelect = async (event) => {
    console.log("Is the modal open? ", isOpen);
    event.stopPropagation();
    let filePath;
    let file_id;
    let fsl = await fileSizeLimit(plan); // fsl -> fileSizeLimit
    let upl = await uploadLimit(plan); // upl -> uploadLimit
    console.log("fsl", fsl);
    console.log("file chosen, upload it to db", event);

    // check if both cases are true first
    if (uploadCount >= upl && event.target.files[0].size > fsl) {
      showToast(
        "File and upload limit reached!",
        "You have reached your upload limit, and file size limit"
      );
      closeModal();
      return;
    }

    if (uploadCount >= upl) {
      // setIsOverPDFCount(true);
      console.log("Upload limit reached!", "YOU HAVE UPLOADED TOO MANY PDFSSS");
      showToast("Upload limit reached", "You have reached your upload limit");
      closeModal();
      return;
    }

    if (event.target.files[0].size > fsl) {
      showToast("File size limit reached!", "The PDF file is over your limit");
      closeModal();
      // setFileOverLimit(true);
      console.log("SHIT IS TOO BIGG FAMALAM");
      event.target.value = "";
    } else {
      console.log("Is the modal open? ", isOpen);

      filePath = `${userId}/${event.target.files[0].name}`;
      console.log("userid", userId);
      const { data, error } = await supabase.storage
        .from("pdfs")
        .upload(filePath, event.target.files[0]);
      if (error) {
        setDuplicateFileError(true);
        // Handle error
        console.log("error", error.message);
        return;
      } else {
        setDuplicateFileError(false);

        setPdf(event.target.files[0]); // call method
        console.log("Is the modal open? ", isOpen);

        console.log("File upload success", data);
        console.log("data.id", data.id);
        file_id = data.id;
        // Handle success
      }

      try {
        console.log("Is the modal open? ", isOpen);

        const formData = new FormData();
        // a web API that allows you to easily construct a set of key/value pairs representing form fields and their values
        formData.append("file", event.target.files[0]);
        formData.append("file_title", event.target.files[0].name);
        formData.append("file_id", file_id);
        formData.append("userId", userId);

        const response = await fetch("/api/chat", {
          method: "POST",
          body: formData,
        });

        console.log("Content-Type: ", response.headers.get("Content-Type"));

        if (response.ok) {
          console.log("Is the modal open? ", isOpen);

          try {
            setIsTextDisabled(false);
            const textResponse = await response.text(); // Read response as text
            console.log("Response Text: ", textResponse);

            // If you still need to parse JSON from the text
            try {
              const data = JSON.parse(textResponse); // Try parsing as JSON
              console.log("Parsed Data: ", data);
              setCurrentPdfId(data.pdfIds);
              setChatId(data.chatId);
              history.replaceState(data, "convo", `/chat/${data.pdfIds}`);

              // router.replace(`/chat/${data.pdfIds[0]}`, undefined, { shallow: true });
            } catch (jsonError) {
              console.error("Error parsing JSON from text: ", jsonError);
              // Handle case where text is not JSON
            }
          } catch (error) {
            console.error("Error reading text response: ", error);
          }
        } else {
          console.log("Response not OK: ", response.status);
        }

        // const result = await response.json();
        // console.log(result); // handle the response
      } catch (error) {
        console.log("error in chat page", error);
      }
    }
  };

  function closeModal() {
    setDuplicateFileError(false);
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function showToast(title, desc) {
    toast(title, {
      description: desc,
      position: "top-right",

      action: {
        label: "Understood",
        onClick: () => console.log("Undo"),
      },
    });
  }

  return (
    <div className="mx-12 mx-12 flex flex-col lg:grid lg:grid-cols-2">
      <div className="rounded-lg border shadow5 ">
        {pdf ? (
          <div className=" p-12 bg-gray h-[800px] overflow-y-auto  ">
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.apply(null, Array(numPages))
                .map((x, i) => i + 1)
                .map((page) => {
                  return (
                    <Page
                      className="mb-12"
                      pageNumber={page}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  );
                })}
            </Document>
          </div>
        ) : (
          <div className="flex justify-center mt-48">
            <button onClick={openModal}> Click me</button>
            <div className="text">{/* <span>Click to upload PDF</span> */}</div>

            <Modal
              title={"Upload your PDF"}
              isOpen={isOpen}
              closeModal={closeModal}
              openModal={openModal}
              onFileSelect={onFileSelect}></Modal>

            {/* <input
                size="100"
                onChange={(event) => onFileSelect(event)}
                type="file"
                id="file"
                accept="application/pdf"></input> */}
          </div>
        )}

        {pdf && (
          <p>
            Page {pageNumber} of {numPages}
          </p>
        )}
      </div>

      <div className="flex flex-col justify-between h-full">
        <div className="flex-grow overflow-y-auto">
          <ConversationDisplay
            showThinkingAnimation={showThinkingAnimation}
            conversation={conversation}
          />
        </div>

        <div className="mt-4">
          <TextField
            // isDisabled={isTextDisabled}
            onSendMessage={sendMessage}></TextField>
        </div>
      </div>
    </div>
  );
}
