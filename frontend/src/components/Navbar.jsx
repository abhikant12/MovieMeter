import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Search } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

const Navbar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user, logout } = useAuthStore();

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	const { setContentType } = useContentStore();

	return (
		<header className='max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20'>
			<div className='flex items-center gap-10 z-50'>
				<Link to='/'>
			     	<div className='w-32 sm:w-40 text-cyan-300   font-bold text-2xl tracking-wide'> Movie Meter </div>
				</Link>

				{/* desktop navbar items */}
				<div className='hidden sm:flex gap-8 items-center'>
					<Link to='/'  className='relative text-gray-300 font-medium text-lg hover:text-cyan-300 transition duration-200 before:content-[""] before:absolute before:left-0 before:bottom-0 before:w-full before:h-0.5 before:bg-cyan-300 before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100'  onClick={() => setContentType("movie")}>
						Movies
					</Link>
				
				   <Link to='/'     className='relative text-gray-300 font-medium text-lg hover:text-cyan-300 transition duration-200 before:content-[""] before:absolute before:left-0 before:bottom-0 before:w-full before:h-0.5 before:bg-cyan-300 before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100'  onClick={() => setContentType("tv")}>
						Tv Shows
					</Link>
					
					<Link to='/history'     className='relative text-gray-300 font-medium text-lg hover:text-cyan-300 transition duration-200 before:content-[""] before:absolute before:left-0 before:bottom-0 before:w-full before:h-0.5 before:bg-cyan-300 before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100' >
						Search History
					</Link>

					<Link to='/recommend'     className='relative text-gray-300 font-medium text-lg hover:text-cyan-300 transition duration-200 before:content-[""] before:absolute before:left-0 before:bottom-0 before:w-full before:h-0.5 before:bg-cyan-300 before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100' >
						Recommend
					</Link>
				</div>
			</div>

			<div className='flex gap-4 items-center z-50'>
				<Link to="/search" className='p-2 rounded hover:bg-gray-800 transition duration-200'>
					<Search className='h-6 w-6 text-gray-300 cursor-pointer' />
				</Link>
				
				<Link to="/profile" className='relative'>
					<img src={user.image} alt='Avatar' className='h-10 w-10 rounded-full border-2 border-gray-700 transition-transform duration-200 hover:scale-105 cursor-pointer' />
				</Link>
				
				<button className='p-2 rounded hover:bg-gray-800 transition duration-200' onClick={logout} >
					<LogOut className='h-6 w-6 text-gray-300 cursor-pointer' />
				</button>
				
				<div className='sm:hidden'>
					<Menu className='h-6 w-6 text-gray-300 cursor-pointer' onClick={toggleMobileMenu} />
				</div>
			</div>



			{/* mobile navbar items */}
			{isMobileMenuOpen && (
				<div className='w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800'>
					<Link to={"/"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						Movies
					</Link>
					<Link to={"/"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						Tv Shows
					</Link>
					<Link to={"/history"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						Search History
					</Link>
				</div>
			)}
		</header>
	);
};
export default Navbar;
