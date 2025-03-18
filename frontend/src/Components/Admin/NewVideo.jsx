import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";

export default function AllVideo() {
    const { Toast } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [videos, setVideos] = useState([]);
    const [videoImages, setVideoImages] = useState({}); // Stores images per video
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [UploadModelOpen, setUploadModelOpen] = useState(false);
    const [videouploadFile, setUploadVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const { API_BASE_URL, API_URL, VIDEO_BASE_URL } = useContext(ProjectContext)

    const handleVideoChange = (event) => {
        setUploadVideoFile(event.target.files[0]);
    };

    const handleThumbnailChange = (event) => {
        setThumbnailFile(event.target.files[0]);
    };

    // useEffect(() => {
    const fetchVideos = async () => {
        try {
            const response = await axios.get(API_BASE_URL + API_URL + VIDEO_BASE_URL + "/all-video");
            setVideos(response.data.videos);
        } catch (err) {
            console.error("Error fetching videos:", err);
        }
    };
    // }, []);
    useEffect(() => {
        fetchVideos();

    }, [videos])
    const closeuploadModal = () => {
        setUploadModelOpen(false);
    };


    useEffect(() => {
        if (videoLoading) {
            document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
            document.body.style.overflow = "auto"; // Enable scrolling
        }

        return () => {
            document.body.style.overflow = "auto"; // Cleanup when unmounting
        };
    }, [videoLoading]);

    // Fetch images for videos
    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            for (const video of videos) {
                try {
                    const imageUrl = `${API_BASE_URL}/get-image-url?filename=${encodeURIComponent(video.title)}.png`;
                    images[video.title] = imageUrl;
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            }
            setVideoImages(images);
        };
        if (videos.length > 0) fetchImages();
    }, [videos]);



    const handlePlayVideo = async (filename) => {
        setVideoLoading(true);
        try {
            const videoUrl = `${API_BASE_URL}/get-image-url?filename=${encodeURIComponent(filename)}.mp4`;
            setSelectedVideo(videoUrl);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching video:", error);
            Toast.fire({ icon: "error", title: "Error loading video" });
        } finally {
            setVideoLoading(false);
        }

    };

    const handleUploadSubmit = async (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const description = event.target.description.value;
        if (!title || !description || !thumbnailFile || !videouploadFile) {
            return Toast.fire({ icon: "error", title: "Please select files first!" });
        }
        setLoading(true);
        try {
            // Step 1: Request upload URLs from backend
            const response = await fetch(API_BASE_URL + API_URL + VIDEO_BASE_URL + "/get-new-upload-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    videoType: videouploadFile.type,
                    thumbnailType: thumbnailFile.type,
                }),
            });
            if (!response.ok) throw new Error("Failed to get upload URLs");
            const data = await response.json();
            // Step 2: Upload video file to S3
            await axios.put(data.video.url, videouploadFile, {
                headers: { "Content-Type": videouploadFile.type },
            });
            // Step 3: Upload thumbnail file to S3
            await axios.put(data.thumbnail.url, thumbnailFile, {
                headers: { "Content-Type": thumbnailFile.type },
            });
            // Step 4: Save video details to MongoDB
            const saveResponse = await fetch(API_BASE_URL + API_URL + VIDEO_BASE_URL + "/save-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    videoUrl: `https://your-bucket-name.s3.amazonaws.com/webdev/${data.video.filename}`,
                    thumbnailUrl: `https://your-bucket-name.s3.amazonaws.com/webdev/${data.thumbnail.filename}`,
                }),
            });
            const saveData = await saveResponse.json();
            if (!saveData.success) throw new Error("Failed to save video in database");
            Toast.fire({ icon: "success", title: "Video uploaded & saved successfully!" });
            setUploadVideoFile(null);
            setThumbnailFile(null);
            setUploadModelOpen(false);
        } catch (error) {
            console.error("Error uploading video:", error);
            Toast.fire({ icon: "error", title: "Upload Failed", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) {
            document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
            document.body.style.overflow = "auto"; // Enable scrolling
        }

        return () => {
            document.body.style.overflow = "auto"; // Cleanup when unmounting
        };
    }, [loading]);

    const handleVideoDelete = async (_id, title) => {
        try {
            console.log("_id:", _id);
            console.log("title:", title);

            // 🔹 Show confirmation alert before deleting
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // 🔹 Perform the delete request
                        const response = await axios.delete(`${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/delete-video/${_id}`, {
                            params: { title }
                        });

                        console.log(response.data.message);
                        fetchVideos(); // ✅ Refresh video list after deletion

                        // 🔹 Show success message after deletion
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });

                    } catch (error) {
                        console.error("Error deleting video:", error.response?.data?.message || error.message);
                        Swal.fire({
                            title: "Error",
                            text: "Something went wrong!",
                            icon: "error"
                        });
                    }
                }
            });

        } catch (error) {
            console.error("Error initializing delete process:", error.message);
        }
    };


    return (
        <>
            <div className="p-6 min-h-screen ">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">All Video ({videos.length})</h2>

                    <div onClick={() => setUploadModelOpen(true)} className="px-4 py-2 text-white bg-green-500 cursor-pointer rounded-2xl">
                        Upload video
                    </div>
                </div>

                <div className="bg-white rounded-lg  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {videos.length > 0 ? (
                        videos.map((video, index) => (
                            <div key={index} className="bg-white rounded-lg hover:scale-105 duration-400 shadow-md overflow-hidden text-center">
                                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${videoImages[video.title]})` }} ></div>
                                <div className="p-4 ">
                                    <h3 className="text-lg font-bold mb-2">{video.title}</h3>

                                    <p >{video.description}</p>
                                    <div className=" flex justify-evenly items-center py-4">
                                        <button onClick={() => handlePlayVideo(video.title)} type="button" class=" cursor-pointer bg-gray-950 hover:bg-gray-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"> Watch Now</button>
                                        <svg onClick={() => handleVideoDelete(video._id, video.title)} xmlns="http://www.w3.org/2000/svg" className=" cursor-pointer hover:scale-105 duration-300 text-red-600" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                                            <path fill="red" d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No videos uploaded yet.</p>
                    )}
                </div>


            </div>
            {UploadModelOpen && (
                <div className="fixed inset-0 flex items-center justify-center  bg-black/50 bg-opacity-75 z-50">
                    <div className=" flex items-center justify-center rounded-2xl bg-white p-4">
                        <div className="w-full max-w-3xl p-6  ">
                            <div className=" flex justify-between items-center">
                                <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
                                <button
                                    className={`text-black text-2xl font-bold cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center 
                                   ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={!loading ? closeuploadModal : undefined} // Prevent closing when loading
                                    disabled={loading}  // Disable button when uploading
                                >
                                    ✕
                                </button>
                            </div>
                            <form className="space-y-4"
                                onSubmit={handleUploadSubmit}>
                                <div className=" grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                                            Video File
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <>
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true" >
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="video" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                            <span>Upload a file</span>
                                                            <input id="video" name="video" type="file" className="sr-only" accept="video/*" setUploadVideoFile onChange={handleVideoChange} />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500"> This only support MP4 file </p>
                                                </>
                                            </div>
                                        </div>
                                        {videouploadFile ? <h1 className=" text-green-400">Selected</h1> : <h1 className=" text-blue-600">Not Selected </h1>}
                                    </div>
                                    <div>
                                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                                            Thumbnail Photo
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center ">
                                                <>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true" >
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                            <span>Upload a file</span>
                                                            <input id="thumbnail" name="thumbnail" type="file" className="sr-only" accept="image/*" onChange={handleThumbnailChange} />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">This only support PNG file </p>
                                                </>
                                            </div>
                                        </div>
                                        {thumbnailFile ? <h1 className=" text-green-400"> Selected </h1> : <h1 className=" text-blue-600">Not Selected </h1>}
                                    </div>
                                </div>
                                <div className=" grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title  </label>
                                        <input id="title" name="title" placeholder="Enter title" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <input id="description" name="description" placeholder="Enter description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                                <button
                                    disabled={loading}
                                    // onClick={!loading ? handleUploadSubmit : undefined}
                                    // disabled={loading}  // Disable button when uploading

                                    type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    {/* <div className="mr-2 h-4 w-4"
                                        onClick={!loading ? handleUploadSubmit : undefined}
                                        disabled={loading}  // Disable button when uploading

                                    > {loading ? "Uploading..." : "Upload "}
                                    </div> */}
                                    {loading ? "Uploading..." : "Upload "}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {videoLoading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {/* Video Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="relative bg-white p-4 rounded-lg w-full max-w-3xl">
                        <button className="absolute z-50 top-3 right-3 text-black text-2xl font-bold bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={() => {
                                setIsModalOpen(false);
                                setSelectedVideo(null);
                            }}
                        > ✕
                        </button>
                        <div className="relative">
                            <ReactPlayer
                                key={selectedVideo} // Force re-render when video changes
                                url={selectedVideo} // Video source 
                                playing={isModalOpen}
                                controls
                                width="100%"
                                height="auto"
                                className="rounded-lg"
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: "nodownload", // Prevent download option
                                            onContextMenu: (e) => e.preventDefault(), // Disable right-click
                                        },
                                    },
                                }}
                            />
                            {/* Watermark */}
                            <img
                                src="https://www.requingroup.com/logo.png"
                                className="absolute top-5 right-5 w-20 opacity-50"
                                alt="Watermark"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}





