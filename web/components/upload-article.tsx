"use client";

import { Dispatch, SetStateAction, useState } from "react";

const UploadArticleModal = ({
  titleEntries,
  setTitleEntries,
  handleUploadFile,
  handleSubmit,
}: {
  titleEntries: string;
  setTitleEntries: Dispatch<SetStateAction<string>>;
  handleUploadFile(files: FileList | null): void;
  handleSubmit(): void;
}) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      {openModal ? (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="flex justify-center w-full h-full items-center bg-black bg-opacity-30">
            <div className="h-[30vh] min-w-[30vw] bg-slate-100 p-5 flex flex-col justify-between">
              <div>
                <input
                  onChange={(e) => handleUploadFile(e.target.files)}
                  type="file"
                />
                <input
                  value={titleEntries}
                  placeholder="Input Title"
                  onChange={(e) => setTitleEntries(e.target.value)}
                  type="text"
                />
                <button type="button" onClick={() => handleSubmit()}>
                  Submit
                </button>
              </div>
              <div className="w-ful flex justify-center">
                <button
                  type="button"
                  className="text-black"
                  onClick={() => setOpenModal(false)}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <button
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setOpenModal(true)}
      >
        Upload New Article
      </button>
    </>
  );
};

export default UploadArticleModal;
