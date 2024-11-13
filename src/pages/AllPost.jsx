import React, { useState, useEffect } from "react";
import { Container, Loader } from "../Components";
import { useNavigate } from "react-router-dom";
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
      setIsFetching(true);
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
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    syncAllPosts();
  }, [connected]);

  const noPosts = !postList || postList.length === 0;
  console.log(noPosts);

  return (
    <div className="w-full py-8 min-h-96">
      <div>
        <h1 className="text-2xl md:text-3xl text-center font-semibold">
          All Posts
        </h1>
      </div>
      {isFetching ? (
        <div className="flex items-center justify-center h-[calc(100vh-320px)]">
          <Loader />
        </div>
      ) : noPosts ? (
        <div className="flex items-center justify-center h-[calc(100vh-320px)] text-white text-4xl">
          No posts available
        </div>
      ) : (
        <Container>
          <div className="flex flex-col space-y-4 p-10 overflow-y-auto max-h-[calc(100vh-200px)] scroll-smooth scrollbar-hide">
            {postList &&
              postList.map((post, index) => (
                <div
                  key={index}
                  className="p-4 border border-yellow-500 rounded-lg bg-[#252422]"
                >
                  <a
                    href={`/post/${post.ID}`}
                    className="no-underline text-gray-500 hover:text-yellow-600"
                  >
                    <h3 className="text-xl font-bold font-sans text-yellow-600 capitalize">
                      {post.Title}
                    </h3>
                    <p className="mt-5 text-white">{post.Author}</p>
                    <p className="mt-3 text-white">{post.ID}</p>
                  </a>
                </div>
              ))}
          </div>
        </Container>
      )}
    </div>
  );
}

export default AllPosts;
