import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import Navbar from "../components/Navbar";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";

const RecommendationComponent = () => {
	const [movieName, setMovieName] = useState("");
	const [trailers, setTrailers] = useState([]);
	const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
	const [loading, setLoading] = useState(false);
	const [content, setContent] = useState({});
	const [recommendedMovies, setRecommendedMovies] = useState([]);

	const sliderRef = useRef(null);

	const recommend = async (movieTitle) => {
		setLoading(true);
		try {
            
			setMovieName(movieTitle);
			const response = await axios.post("http://localhost:5001/recommend", {
				movie_title: movieTitle
			}, {
				headers: {
					"Content-Type": "application/json"
				}
			});
			
             const recommendedMovieIds = response.data;                 // Assuming response is an array of movie IDs
             setRecommendedMovies(recommendedMovieIds);
             console.log(response.data);

			 const firstMovieId = recommendedMovieIds[0].id;    
			 console.log(firstMovieId);
			                       

			// Fetch trailers and details of the specified movie
            const res = await axios.get(`/api/v1/movie/${firstMovieId}/details`);
            setContent(res.data.content);

            const res1 = await axios.get(`/api/v1/movie/${firstMovieId}/trailers`);
            setTrailers(res1.data.trailers);

		} catch (error) {
			console.error("Error fetching recommendations:", error);
			setContent(null);
			setTrailers([]);
		} finally {
			setLoading(false);
		}
	};


	const handleNext = () => {
		if (currentTrailerIdx < trailers.length - 1) setCurrentTrailerIdx(currentTrailerIdx + 1);
	};
	const handlePrev = () => {
		if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
	};

	const scrollLeft = () => {
		if (sliderRef.current) sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
	};
	const scrollRight = () => {
		if (sliderRef.current) sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

	if (loading) return <WatchPageSkeleton />;

	return (
		<div className='bg-black min-h-screen text-white'>
			<div className='mx-auto container px-4 h-full'>
				<Navbar />

				{/* Search Section */}
				<div className='flex items-center justify-center mb-10'>
					<input
						type='text'
						placeholder='Enter movie name'
						value={movieName}
						onChange={(e) => setMovieName(e.target.value)}
						className='p-2 rounded-lg bg-gray-700 text-white mr-4 w-[40%]'
					/>
					<button
						onClick={() => recommend(movieName)}
						className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
					>
						Recommend
					</button>
				</div>


				 
                {content?.title && (
                        <>
                            {/* Trailer Section */}
                            {trailers.length > 0 && (
                                <div className='flex justify-between items-center mb-4'>
                                    <button
                                        className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                        disabled={currentTrailerIdx === 0}
                                        onClick={handlePrev}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === trailers.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                        disabled={currentTrailerIdx === trailers.length - 1}
                                        onClick={handleNext}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}

                            <div className='aspect-video mb-8 p-2 sm:px-10 md:px-32'>
                                {trailers.length > 0 ? (
                                    <ReactPlayer
                                        controls={true}
                                        width={"100%"}
                                        height={"70vh"}
                                        className='mx-auto overflow-hidden rounded-lg'
                                        url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
                                    />
                                ) : (
                                    <h2 className='text-xl text-center mt-5'>
                                        No trailers available for <span className='font-bold text-red-600'>{content?.title || content?.name}</span> 😥
                                    </h2>
                                )}
                            </div>

                            {/* Movie Details Section */}
                            <div className='flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto'>
                                <div className='mb-4 md:mb-0'>
                                    <h2 className='text-5xl font-bold text-balance'>{content?.title || content?.name}</h2>
                                    <p className='mt-2 text-lg'>
                                        {formatReleaseDate(content?.release_date || content?.first_air_date)} |{" "}
                                        {content?.adult ? (
                                            <span className='text-red-600'>18+</span>
                                        ) : (
                                            <span className='text-green-600'>PG-13</span>
                                        )}
                                    </p>
                                    <p className='mt-4 text-lg'>{content?.overview}</p>
                                </div>
                                <img
                                    src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
                                    alt='Poster image'
                                    className='max-h-[600px] rounded-md'
                                />
                            </div>
                        </>
                    )}



				 {/* Recommended Movies Section */}
				{recommendedMovies.length > 0 && (
					<div className='mt-12 max-w-5xl mx-auto relative'>
						<h3 className='text-3xl font-bold mb-4'>Recommended Movies</h3>

						<div className='flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group' ref={sliderRef}>
							{recommendedMovies.map((movie) => (
								<div
									key={movie.id}
									className='flex-none w-52 p-4 bg-gray-800 text-white text-center rounded-md transition duration-300 hover:bg-red-600 cursor-pointer'
									onClick={() => recommend(movie.title)}         
								>
									<img 
										src={movie.poster_url} 
										alt={movie.title} 
										className='w-full h-auto mb-2 rounded-md' 
									/>
									<h4 className='text-lg font-semibold'>{movie.title}</h4>
								</div>
							))}

							<ChevronRight
								className='absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full'
								onClick={scrollRight}
							/>
							<ChevronLeft
								className='absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full'
								onClick={scrollLeft}
							/>
						</div>
					</div>
				)}


			</div>
		</div>
	);
};

export default RecommendationComponent;
