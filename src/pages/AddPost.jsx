import React from 'react'
import { Button, Container, PostForm } from '../Components'
import { useEffect, useState } from "react";
import { Loader } from "../Components";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect";

function AddPost() {
  const { connected } = useConnection();
  const processId = "qYkkKTD1-PPySlWQ_1X6z8gEV6CpGTlG-3u4d52BA9A";
  const [isFetching, setIsFetching] = useState(false);
  const [authorList, setAuthorList] = useState([]);
  const [name, setName] = useState("");

  const activeAddress = useActiveAddress();

  const syncAllAuthors = async () => {
    if (!connected) {
      return;
    }

    try {
      setIsFetching(true);
      const res = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "AuthorList" }],
        anchor: "1234",
      });
      console.log("Dry run Author result", res);
      const filteredResult = res.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered Author result", filteredResult);
      setAuthorList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const registerAuthor = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register" }, { name: "Name", value: name }],
      data: "",
      signer: createDataItemSigner(window.arweaveWallet),
    });

    console.log("Register Author result", result);

    const registerResult = await result({
      process: processId,
      message: res,
    });

    console.log("Registered successfully", registerResult);

    const data = registerResult.Messages[0].Data;
    console.log(data); // This will output 'Already Registered'

    if (registerResult.Messages[0].Data === "Successfully Registered." || registerResult.Messages[0].Data === "Already Registered.") {
      syncAllAuthors();
    }
  };

  useEffect(() => {
    syncAllAuthors();
    console.log("This is active address", activeAddress);
    console.log(
      "Includes author",
      authorList.some((author) => author.PID === activeAddress)
    );
  }, [connected]);

  return (
    <div className='py-8'>
      <div><h1 className=' text-[2rem] md:text-[2.5rem] text-center font-semibold' >Add Post</h1></div>
      {isFetching ? (
        <div className="flex items-center justify-center h-[calc(100vh-320px)]">
        <Loader />
      </div>
      ) : authorList.some((author) => author.PID === activeAddress) ? (
        <Container>
            <PostForm />
        </Container>
      ) : (
        <div className="flex items-center justify-center min-h-[50vh]">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
            className="p-2 px-3 py-4 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200"
          />
          <Button
            onClick={registerAuthor}
            className="my-7 md:py-2 py-1 px-4 text-white font-weight-400 bg-customYellow rounded-xl shadow-lg duration-200 hover:cursor-pointer hover:bg-white hover:text-black hover:scale-105 md:mx-2 md:my-6"
          >
            Register
          </Button>
        </div>
      )}
    </div>
  )
}

export default AddPost