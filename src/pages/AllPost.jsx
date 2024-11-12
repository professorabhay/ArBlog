import React, { useState, useEffect } from 'react';
import { Container, PostCard, Button, Loader } from '../Components';
import { useNavigate } from 'react-router-dom';
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

function AllPosts() {

  const { connected } = useConnection();
  const processId = "qYkkKTD1-PPySlWQ_1X6z8gEV6CpGTlG-3u4d52BA9A";
  const [isFetching, setIsFetching] = useState(false);
  const [postList, setPostList] = useState();
  const navigate = useNavigate();

  const syncAllPosts = async () => {
    if (!connected) return;

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "List" }],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setPostList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    setIsFetching(false);
  }, [connected]);

  return (
    <div className='w-full py-8'>
      <div>
        <h1 className='text-2xl md:text-3xl text-center font-semibold'>All Posts</h1>
      </div>
      <Container>
        <div className="flex flex-col space-y-4 p-10 overflow-y-auto max-h-[calc(100vh-200px)] scroll-smooth scrollbar-hide">
          {isFetching && <div className='text-white'>Fetching posts...</div>}
          {postList &&
            postList.map((post, index) => (
              <div key={index} className="p-4 border border-yellow-500 rounded-lg bg-[#252422]">
                <a href={`/post/${post.ID}`} className="no-underline text-gray-500 hover:text-yellow-600">
                  <h3 className='text-xl font-bold font-sans text-yellow-600 capitalize'>{post.Title}</h3>
                  <p className='mt-5 text-white'>{post.Author}</p>
                  <p className='mt-3 text-white'>{post.ID}</p>
                </a>
              </div>
            ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
