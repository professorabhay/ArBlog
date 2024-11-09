// import React, { useState, useEffect } from 'react';
// import { Container, PostCard, Button, Loader } from '../Components';
// import { useNavigate } from 'react-router-dom';
// import { useConnection } from "@arweave-wallet-kit/react";
// import { dryrun } from "@permaweb/aoconnect";

// function AllPosts() {

//   const { connected } = useConnection();
//   const processId = "qYkkKTD1-PPySlWQ_1X6z8gEV6CpGTlG-3u4d52BA9A";
//   const [isFetching, setIsFetching] = useState(false);
//   const [postList, setPostList] = useState();
//   const navigate = useNavigate();

//   const syncAllPosts = async () => {
//     // setIsFetching(true);
//     if (!connected) {
//       // setIsFetching(false);
//       return;
//     }

//     try {
//       const result = await dryrun({
//         process: processId,
//         data: "",
//         tags: [{ name: "Action", value: "List" }],
//         anchor: "1234",
//       });
//       console.log("Dry run result", result);
//       const filteredResult = result.Messages.map((message) => {
//         const parsedData = JSON.parse(message.Data);
//         return parsedData;
//       });
//       console.log("Filtered result", filteredResult);
//       setPostList(filteredResult[0]);
//     } catch (error) {
//       console.log(error);
//     }

//     // setIsFetching(false);
//   };

//   useEffect(() => {
//     setIsFetching(true);
//     syncAllPosts();
//     setIsFetching(false);
//   }, [connected]);

//   return (
//     <div className='w-full py-8'>
//       <div>
//         <h1 className='text-[2rem] md:text-[2.5rem] text-center font-semibold'>All Posts</h1>
//       </div>
//       <Container>
//       <div style={styles.parentDiv}>
//         {isFetching && <div className='text-white'>Fetching posts...</div>}
//         {postList &&
//           postList.map((post, index) => (
//             <div key={index} style={styles.postDiv}>
//               <a href={`/post/${post.ID}`} style={styles.postLink}>
//                 <h3 style={styles.postHeading} className='text-xl
//                  font-bold font-sans text-gray-500 capitalize'>{post.Title}</h3>
//                 <p style={styles.postContent} className='mt-5 text-white'>{post.Author}</p>
//                 <p style={styles.postContent} className='mt-3 text-white'>{post.ID}</p>
//               </a>
//             </div>
//           ))}
//       </div>
//       </Container>
//     </div>
//   );
// }

// const styles = {
//   parentDiv: {
//     height: "calc(100vh - 72px)",
//     display: "flex",
//     flexDirection: "column",
//     padding: "40px",
//   },
//   horizontalRule: {
//     border: 0,
//     clear: "both",
//     display: "block",
//     width: "100%",
//     backgroundColor: "#ccc",
//     height: "1px",
//   },
//   postDiv: {
//     padding: "10px 20px",
//     border: "1px solid #ffbe0b",
//     borderRadius: "8px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "6px",
//     marginBottom: "10px",
//   },
//   postHeading: {
//     margin: "0px",
//     text: "bold",
//     fontSize: "30px",
//     padding: "0px",
//   },
//   postContent: {
//     padding: "0px",
//     fontSize: "14px",
//   },
//   postLink: {
//     textDecoration: "none",
//     color: "#555",
//   },
// };

// export default AllPosts;

import React, { useEffect, useState } from 'react';
import { Container } from '../Components';
import { useNavigate } from 'react-router-dom';
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import { useQuery } from 'react-query';

function AllPosts() {
  const { connected } = useConnection();
  const processId = "qYkkKTD1-PPySlWQ_1X6z8gEV6CpGTlG-3u4d52BA9A";
  const navigate = useNavigate();
  
  // React Query fetch function
  const fetchPosts = async () => {
    if (!connected) return [];
    const result = await dryrun({
      process: processId,
      data: "",
      tags: [{ name: "Action", value: "List" }],
      anchor: "1234",
    });
    return result.Messages.map((message) => JSON.parse(message.Data))[0];
  };

  // Use React Query to manage and cache the posts
  const { data: postList, isLoading } = useQuery(
    ['posts', connected], // Unique query key based on connection state
    fetchPosts,
    {
      enabled: connected, // Only run query if connected
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes even if unused
    }
  );

  return (
    <div className='w-full py-8'>
      <div>
        <h1 className='text-[2rem] md:text-[2.5rem] text-center font-semibold'>All Posts</h1>
      </div>
      <Container>
        <div style={styles.parentDiv}>
          {isLoading && <div className='text-white'>Fetching posts...</div>}
          {postList && postList.map((post, index) => (
            <div key={index} style={styles.postDiv}>
              <a href={`/post/${post.ID}`} style={styles.postLink}>
                <h3 style={styles.postHeading} className='text-xl font-bold font-sans text-gray-500 capitalize'>
                  {post.Title}
                </h3>
                <p style={styles.postContent} className='mt-5 text-white'>{post.Author}</p>
                <p style={styles.postContent} className='mt-3 text-white'>{post.ID}</p>
              </a>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

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
  postHeading: {
    margin: "0px",
    fontSize: "30px",
    padding: "0px",
  },
  postContent: {
    padding: "0px",
    fontSize: "14px",
  },
  postLink: {
    textDecoration: "none",
    color: "#555",
  },
};

export default AllPosts;
