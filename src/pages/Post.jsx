import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

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
          // Attempt to parse `message.Data`
          parsedData = JSON.parse(message.Data);
        } catch (parseError) {
          console.error("Error parsing message data", parseError);
          return [];
        }

        // If parsedData is an array, proceed
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
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    setIsFetching(false);
  }, [connected]);

  const post = postContent?.find((post) => post.ID === postId);

console.log(
  post
)

  return (
    <div className='w-full py-8'>
    {isFetching && <div>Fetching post...</div>}
    {post ? (
      <div style={styles.parentDiv}>
        <div style={styles.postDiv} className="bg-[#252422]">
        <h2 style={styles.postHeading} className='text-xl
                 font-bold font-sans text-yellow-600 capitalize'>{post.Title}</h2>
        <p style={styles.postContent} className='mt-5 text-white'>{post.Author}</p>
        <p style={styles.postContent} className='mt-3 text-white'>{post.ID}</p>
        <Link to="/posts" style={styles.postLink}>
          <button className={"mt-4 bg-customYellow text-white rounded-xl px-5 py-2 hover:bg-white hover:text-black hover:border hover:border-solid hover:border-grayBorder hover:cursor-pointer"}>Back</button>
        </Link>
        </div>
      </div>
    ) : (
      <div className="ml-52"></div>
    )}
  </div>
);
};

export default ViewPost;

const styles = {
  parentDiv: {
    height: "calc(100vh - 72px)",
    display: "flex",
    flexDirection: "column",
    padding: "40px",
  },
  postDiv: {
    padding: "10px 20px",
    border: "1px solid #ffbe0b",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "10px",
  },
  horizontalRule: {
    border: 0,
    clear: "both",
    display: "block",
    width: "100%",
    backgroundColor: "#ccc",
    height: "1px",
  },
  postHeading: {
    margin: "0px",
    text: "bold",
    fontSize: "30px",
    padding: "0px",
  },
  postContent: {
    padding: "0px",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid #000",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100px",
    marginTop: "20px",
  },
  postLink: {
    textDecoration: "none",
    color: "#fff",
  },
};
