import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import parse from 'html-react-parser';
import { Loader } from "../Components";

const ViewPost = () => {
  const { postId } = useParams();
  const { connected } = useConnection();
  const processId = "qYkkKTD1-PPySlWQ_1X6z8gEV6CpGTlG-3u4d52BA9A";
  const [isFetching, setIsFetching] = useState(false);
  const [postContent, setPostContent] = useState();

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      setIsFetching(true);
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "Get" },
          { name: "Post-Id", value: postId },
        ],
        anchor: "1234",
      });

      const filteredResult = result.Messages.flatMap((message) => {
        if (!message.Data) {
          console.error("Message data is missing", message);
          return [];
        }
        let parsedData;
        try {
          parsedData = JSON.parse(message.Data);
        } catch (parseError) {
          console.error("Error parsing message data", parseError);
          return [];
        }

        if (Array.isArray(parsedData)) {
          return parsedData.map((post) => ({
            Title: post.Title || "Untitled",
            ID: post.ID || "N/A",
            Author: post.Author || "Unknown",
            Body: post.Body || "",
          }));
        } else {
          console.error("Parsed data is not an array as expected:", parsedData);
          return [];
        }
      });

      console.log("Filtered result", filteredResult);
      setPostContent(filteredResult);
    } catch (error) {
      console.error("Error in syncAllPosts", error);
    } finally{
      setIsFetching(false);
    }
  };

  useEffect(() => {
    syncAllPosts();
  }, [connected]);

  const post = postContent?.find((post) => post.ID === postId);

  console.log(post);

  return (
    <div className="w-full py-8">
      {isFetching ? (
        <div className="flex items-center justify-center h-[calc(100vh-320px)]">
        <Loader />
      </div>
      ) : post ? (
        <div className="flex flex-col h-[calc(100vh-72px)] p-10">
          <div className="flex flex-col gap-3 p-5 bg-[#252422] border border-yellow-500 rounded-lg max-h-[70vh] overflow-y-auto scrollbar-hide scroll-smooth">
            <h2 className="text-xl font-bold font-sans text-yellow-600 capitalize">
              {post.Title}
            </h2>
            <div className="mt-5 text-white text-sm">
              {parse(post.Body)}
            </div>
            <p className="mt-3 text-white text-sm">{post.ID}</p>
          </div>
          <Link to="/posts">
              <button className="mt-4 bg-yellow-500 text-white rounded-xl px-5 py-2 hover:bg-white hover:text-black border border-transparent hover:border-gray-400 cursor-pointer">
                Back
              </button>
          </Link>
        </div>
      ) : (
        <div className="ml-52"></div>
      )}
    </div>
  );
};

export default ViewPost;
