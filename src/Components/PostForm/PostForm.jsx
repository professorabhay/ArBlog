import React, { useState } from "react";
import { RTE, Button, Input, Loader } from "../index";
import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { useForm, Controller } from "react-hook-form";

function PostForm() {
  const [isPosting, setIsPosting] = useState(false);
  const { connected } = useConnection();
  const processId = "qYkkKTD1-PPySlWQ_1X6z8gEV6CpGTlG-3u4d52BA9A";

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createPost = async (data) => {
    if (!connected) return;

    setIsPosting(true);
    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Create-Post" },
          { name: "Content-Type", value: "text/html" },
          { name: "Title", value: data.title },
        ],
        data: data.content,
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const postResult = await result({
        process: processId,
        message: res,
      });

      reset(); // Clear form
    } catch (error) {
      console.log(error);
    }
    setIsPosting(false);
  };

  return (
    <form onSubmit={handleSubmit(createPost)} className="flex flex-col">
      <div className="w-full lg:w-3/3 px-2">
        {/* Title input */}
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Title"
              className="mb-4"
              error={errors.title?.message}
            />
          )}
        />

        {/* Rich Text Editor */}
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue=""
        />
      </div>
      <div className="w-full lg:w-1/3 px-2">
        {isPosting ? (
          <div className="w-full grid place-items-center">
            <Loader />
          </div>
        ) : (
          <Button
            type="submit"
            disabled={isPosting}
            className="bg-customYellow hover:shadow-customYellow text-white shadow-sm hover:cursor-pointer duration-200 hover:drop-shadow-2xl rounded-lg w-full mt-10 lg:ml-[28vw]"
          >
            Submit
          </Button>
        )}
      </div>
    </form>
  );
}

export default PostForm;
