import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCookie } from "./cookieHelper";


const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			const token = getCookie("jwt"); // Assuming your JWT token is stored in localStorage

			try {
				const res = await fetch("http://localhost:5000/api/users", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`, // Add the token in the Authorization header
						"Content-Type": "application/json", // Ensure correct headers are set
					},
					credentials: "include", 
				});

				// Handle non-200 responses
				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(errorData.message || "Failed to fetch conversations");
				}

				const data = await res.json();
				setConversations(data); // Assuming the response contains an array of conversations
			} catch (error) {
				toast.error(error.message); // Show error toast
			} finally {
				setLoading(false); // Set loading to false once the request is done
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConversations;
