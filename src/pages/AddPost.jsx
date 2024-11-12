import React from 'react'
import { Button, Container, PostForm } from '../Components'
import { useEffect, useState } from "react";
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

  const activeAddress = useActiveAddress();

  const syncAllAuthors = async () => {
    if (!connected) {
      // setIsFetching(false);
      return;
    }

    try {
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
    }

    // setIsFetching(false);
  };

  const registerAuthor = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register" }],
      data: "",
      signer: createDataItemSigner(window.arweaveWallet),
    });

    console.log("Register Author result", result);

    const registerResult = await result({
      process: processId,
      message: res,
    });

    console.log("Registered successfully", registerResult);

    if (registerResult[0].Messages[0].Data === "Successfully Registered.") {
      syncAllAuthors();
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllAuthors();
    console.log("This is active address", activeAddress);
    console.log(
      "Includes author",
      authorList.some((author) => author.PID === activeAddress)
    );

    setIsFetching(false);
  }, [connected]);

  return (
    <div className='py-8'>
      <div><h1 className=' text-[2rem] md:text-[2.5rem] text-center font-semibold' >Add Post</h1></div>
      {isFetching && <div>Fetching posts...</div>}
      {authorList.some((author) => author.PID === activeAddress) ? (
        <Container>
            <PostForm />
        </Container>
      ) : (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Button
            onClick={registerAuthor}
            className="my-7 md:py-2 py-1 px-5 text-white font-weight-400 bg-customYellow rounded-xl shadow-lg duration-200 hover:cursor-pointer hover:bg-white hover:text-black hover:scale-105 md:mx-2 md:my-6"
          >
            Register
          </Button>
        </div>
      )}
    </div>
  )
}

export default AddPost