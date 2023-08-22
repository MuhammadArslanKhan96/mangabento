"use client";
import { useUserContext } from "@/lib/useUserContext";
import { supabase } from "@/modules";
import Link from "next/link";
import React, { useEffect } from "react";

function AuthButtons() {
    const UserContext = useUserContext();

    useEffect(() => {
        const getUser = async () => {
            const userData =`${localStorage.getItem("user")}`;
            if (userData !== `null`) {
                UserContext?.setUser(JSON.parse(userData as string));
            }
        };
        getUser();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="flex justify-center items-center py-5 gap-4">
            {UserContext?.user ? (
                <>
                    <h2>Hello {UserContext?.user.user?.user_metadata.name}</h2>
                    <h4
                        onClick={async () => {
                            const { error } = await supabase.auth.signOut();
                            if (error !== null) {
                                console.log(error.message);
                            }
                            localStorage.setItem('user', 'null')
                            UserContext?.setUser(null);
                        }}
                        className="bg-green-400 cursor-pointer px-4 py-2 rounded"
                    >
                        Logout
                    </h4>
                </>
            ) : (
                <>
                    <Link href={"/register"} className="bg-green-400 px-4 py-2 rounded">
                        Register
                    </Link>
                    <Link href={"/login"} className="bg-green-400 px-4 py-2 rounded">
                        Login
                    </Link>
                </>
            )}
        </div>
    );
}

export default AuthButtons;
