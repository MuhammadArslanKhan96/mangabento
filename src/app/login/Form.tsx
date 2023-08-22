"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/modules";
import Link from "next/link";
import { useUserContext } from "@/lib/useUserContext";
import { useRouter } from "next/navigation";

function Form() {
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");
     const UserData = useUserContext();
     const router = useRouter()

    const Login = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formValues = Object.fromEntries(formData);
        const { email, password } = formValues;
        if (!email || !password) {
            setError("Fill All the Required Fields!");
            return;
        }

        if (password.length < 6) {
            setError("Password must be of min 6 characters!");
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email as string,
                password: password as string
            });

            if(error !== null) {
                setError(error.message);
                return;
            }
            setSuccess('Login Successfully!')
            localStorage.setItem('user', JSON.stringify(data))
            UserData?.setUser(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    function removeError() {
        setError('')
    }


    useEffect(() => {
        if (UserData?.user) {
            router.push("/");
        }
        // eslint-disable-next-line
    }, [UserData?.user]);



    
  return (
    <div>
        <form onSubmit={Login} className="p-4 flex flex-col bg-blue-800 rounded-md gap-3">
                <h2 className="font-bold text-white">Mangabento Login</h2>
                <input onChange={removeError} type="email" className="px-4 py-2 rounded-md" placeholder="Email" name="email" />
                <input onChange={removeError} type="password" className="px-4 py-2 rounded-md" placeholder="Password" name="password" />
                <button className="px-4 py-2 border-2 transition-all duration-300 ease-in-out border-blue-400 hover:bg-blue-400 hover:border-white bg-white rounded-md">
                    Login
                </button>
                <h2 className="text-red-500 text-xs">{error}</h2>
                <h2 className="text-green-500 text-xs">{success}</h2>
                <div className="flex justify-between">
                    <p className="text-xs text-white">Don&apos;t have an account?</p>
                    <Link href={"/register"} className="text-xs text-white">
                        Register
                    </Link>
                </div>
            </form>
    </div>
  )
}

export default Form;
