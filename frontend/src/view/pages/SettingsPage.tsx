import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { getSettingsData } from "../../model/API/settingsData"
import { useNavigate } from "react-router-dom";
import { AuthError } from "../../model/types";

export default function SettingsPage() {
    const navigate = useNavigate();
    const {isFetching, error, data} = useQuery({
        queryKey: ["getSettingsData"],
        queryFn: getSettingsData,
        refetchOnWindowFocus: false
    });

    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
    if (!error){
        setErrorText("");
        return;
    }
    if (error instanceof AuthError){
        navigate("/redirect");
    }else{
        setErrorText(error.message)
    }
    }, [error, navigate]);

    if (isFetching){
        return(<div>Loading...</div>)
    }

    return (
    <>
        <h1>Settings</h1>
        <p>{errorText}</p>
        <p>length: {data?.cycleLength}</p>
        <p>+-: {data?.plusMinus}</p>
        <p>threshold: {data?.threshold}</p>
        <p>use defaults: {data?.useDefaults ? "true" : "false"}</p>
    </>
    )

}
