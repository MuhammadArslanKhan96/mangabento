/* eslint-disable react/display-name */
"use client"
import { UserResponse } from "@supabase/supabase-js";
import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

interface UserContext {
    user: UserResponse["data"] | null;
    setUser: Dispatch<SetStateAction<UserResponse["data"] | null>>;
}


const UserContext = createContext<UserContext | null>(null);

const UserContextProvider = ({ children }: { children?: ReactNode }) => {
    const [user, setUser] = useState<UserResponse["data"] | null>(null);
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};


export default UserContextProvider;

export const useUserContext = () => useContext(UserContext);
