import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { getCookie } from "../hooks/cookieHelper";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		const token = getCookie("jwt");
		try {
			const res = await fetch(`http://localhost:5000/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`, // Add the token in the Authorization header
					"Content-Type": "application/json", // Ensure correct headers are set
				},
				credentials: "include", 
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;