import React, { useEffect, useState } from 'react'
import appwriteService from "../Appwrite/config";
import { Container, PostCard } from '../components'
import authService from '../Appwrite/auth';

function Home() {
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await authService.getCurrentUser();
                setIsLoggedIn(!!user); // Set isLoggedIn to true if user exists

                if (user) {
                    // Fetch posts if the user is logged in
                    const posts = await appwriteService.getPosts();
                    if (posts) {
                        setPosts(posts.documents);
                    }
                }
            } catch (error) {
                console.error("Error fetching user or posts", error);
            }
        };

        checkUserSession();
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    )) : (
                        <div className="p-2 w-full text-center">
                            <h1 className="text-2xl font-bold">No posts available</h1>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Home;
