import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { getSettingsData } from "../../model/API/settingsData"
import { usePutSettingsMutation } from "../../control/mutations/settingsMutations";
import { useNavigate } from "react-router-dom";
import { AuthError, type SettingsData } from "../../model/types";

export default function SettingsPage() {
    const navigate = useNavigate();
    const emptySettings = {
        cycleLength: 0,
        plusMinus: 0,
        threshold: 0,
        useDefaults: false
    }

    const {isFetching, error, data} = useQuery({
        queryKey: ["getSettingsData"],
        queryFn: getSettingsData,
        refetchOnWindowFocus: false
    });

    const [errorText, setErrorText] = useState<string>("");
    const [newSettings, setNewSettings] = useState<SettingsData>(emptySettings);

    const onSuccess = () => {setErrorText("Changes saved successfully")}
    const onError = (error: Error) => {setErrorText(error.message)}

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

    useEffect(() => {
        if(!data){
            return;
        }
        setNewSettings(data);
    }, [data]);


    if (isFetching){
        return(<div>Loading...</div>)
    }

    return (
    <>
        <h1>Settings</h1>
        <p>{errorText}</p>
        <SettingsForm settings={newSettings || emptySettings} setSettings={setNewSettings} onError={onError} onSuccess={onSuccess}/>
    </>
    )

}

function SettingsForm({settings, setSettings, onSuccess, onError}: {settings: SettingsData, setSettings: React.Dispatch<React.SetStateAction<SettingsData>>, onSuccess: () => void, onError: (error: Error) => void}) {
    const navigate = useNavigate();
    const mutation = usePutSettingsMutation(onSuccess, onError);
    const defaultSettings = {
        cycleLength: 28,
        plusMinus: 3,
        threshold: 5,
        useDefaults: false
    }
    return(
    <form className="flex flex-col gap-2 w-xs">
        <div className="flex justify-between">
            <label htmlFor="length">Period length: </label>
            <input id="length" type="number" value={settings.cycleLength} onChange={e => setSettings( (prev: SettingsData) => ({...prev, cycleLength: parseInt(e.target.value)}))}/>
        </div>
        <div className="flex justify-between">
            <label htmlFor="plusMinus">+-: </label>
            <input id="plusMinus" type="number" value={settings.plusMinus} onChange={e => setSettings( (prev: SettingsData) => ({...prev, plusMinus: parseInt(e.target.value)}))}/>
        </div>
        <div className={`flex ${settings.useDefaults ? "hidden" : ""} justify-between`}>
            <label htmlFor="threashold">Threshold: </label>
            <input id="threshold" type="number" value={settings.threshold} onChange={e => setSettings( (prev: SettingsData) => ({...prev, threshold: parseInt(e.target.value)}))}/>
        </div>
        <div className="flex justify-between">
            <label htmlFor="useDefaults">Always use these settings </label>
            <input id="useDefaults" type="checkbox" checked={settings.useDefaults} onChange={e => setSettings( (prev: SettingsData) => ({...prev, useDefaults: e.target.checked}))}/>
        </div>

        <div className="flex gap-2">
            <button className="btn-primary" onClick={e => {e.preventDefault(); mutation.mutate(settings)}}>Save changes</button>
            <button className="btn-primary" onClick={e => {e.preventDefault(); setSettings(defaultSettings)}}>Restore defaults</button>
            <button className="btn-primary" onClick={e => {e.preventDefault(); navigate("/")}}>Cancel</button>
        </div>
    </form>)
}