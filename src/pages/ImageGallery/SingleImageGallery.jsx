import { BsDownload } from "react-icons/bs";
import { IoAlertCircleOutline } from "react-icons/io5";
import { PiShareFill } from "react-icons/pi";

export default function SingleImageGallery() {
    return (
      <div className="w-full mx-auto p-4 mt-16 max-w-[95%] h-screen">
        <div className="rounded-lg overflow-hidden h-full flex flex-col">
          {/* Gradient background div instead of image */}
          <div className="w-full flex-grow bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
          <div className=" p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Title</h3>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-sm text-gray-500">Sub Category</p>
              </div>
              <div className="flex flex-col gap-2 bg-white px-4 py-4 justify-start">
                <button className=" px-8 inline-flex items-center justify-start rounded-md text-12 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 py-2">
                  <BsDownload className="mr-2" /> Download
                </button>
                <button className="inline-flex items-center justify-center rounded-md text-12    font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2">
                  <PiShareFill className="mr-2" /> Share
                </button>
                <button className="inline-flex items-center justify-center rounded-md text-12 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2">
                  <IoAlertCircleOutline className="mr-2 text-[#FF8B8B]" /> Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  