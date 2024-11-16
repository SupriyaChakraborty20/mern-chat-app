import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { getCookie } from "../hooks/cookieHelper";


const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			const token = getCookie("jwt");
			try {
				const res = await fetch(`http://localhost:5000/api/messages/${selectedConversation._id}`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`, // Add the token in the Authorization header
						"Content-Type": "application/json", // Ensure correct headers are set
					},
					credentials: "include", 
				});

				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;