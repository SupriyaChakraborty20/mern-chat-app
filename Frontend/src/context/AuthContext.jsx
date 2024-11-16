import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

	return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};

// Adding PropTypes validation for the 'children' prop
AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired, // Validate that 'children' is passed and is a renderable node
};
