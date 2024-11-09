import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AllPosts from './pages/AllPost.jsx'
import Post from './pages/Post.jsx'
import AddPost from './pages/AddPost.jsx'
import Home from './pages/Home.jsx'
import { ArweaveWalletKit } from "@arweave-wallet-kit/react";
import ArConnectStrategy from "@arweave-wallet-kit/arconnect-strategy";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/posts",
        element: (
          <>
            {" "}
            <AllPosts />
          </>
        ),
      },
      {
        path: "/add-post",
        element: (
          <>
            {" "}
            <AddPost />
          </>
        ),
      },
      {
        path: "/post/:postId",
        element: <Post />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "ACCESS_PUBLIC_KEY",
          "SIGN_TRANSACTION",
          "DISPATCH",
        ],
        ensurePermissions: true,
        strategies: [new ArConnectStrategy()],
      }}
    >
      <RouterProvider router={router}/>
    </ArweaveWalletKit>
    </QueryClientProvider>
  </React.StrictMode>
)
