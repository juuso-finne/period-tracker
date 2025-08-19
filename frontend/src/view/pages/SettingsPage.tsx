import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { getSettingsData } from "../../model/API/settingsData"
import { usePutSettingsMutation } from "../../control/mutations/settingsMutations";
import { useNavigate } from "react-router-dom";
import { AuthError, type SettingsData } from "../../model/types";
import DeleteUserButton from "../components/scripts/DeleteUserButton";

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
    const [isValid, setIsValid] = useState<boolean>(false);

    const onSuccess = () => {setErrorText("Changes saved successfully")}
    const onError = (error: Error) => {setErrorText(error.message)}

    useEffect(() => {
        if (newSettings.cycleLength < 1){
            setIsValid(false);
            setErrorText("Cycle length must be at least 1");
            return;
        }

        if (newSettings.plusMinus < 0){
            setIsValid(false);
            setErrorText("Plus minus must be at least 0");
            return;
        }

        if (newSettings.threshold < 1){
            setIsValid(false);
            setErrorText("Threshold must be at least 1");
            return;
        }

        setErrorText("");
        setIsValid(true);
    }, [newSettings])

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
    <div className="flex flex-col items-center gap-2">
        <h1>Settings</h1>
        <p className="error-text">{errorText}</p>
        <SettingsForm
            settings={newSettings || emptySettings}
            setSettings={setNewSettings}
            onError={onError}
            onSuccess={onSuccess}
            isValid={isValid}
            setErrorText={setErrorText}
        />
    </div>
    )

}

function SettingsForm({settings, setSettings, onSuccess, onError, isValid, setErrorText}: {settings: SettingsData, setSettings: React.Dispatch<React.SetStateAction<SettingsData>>, onSuccess: () => void, onError: (error: Error) => void, isValid:boolean, setErrorText: React.Dispatch<React.SetStateAction<string>>}) {
    const navigate = useNavigate();
    const mutation = usePutSettingsMutation(onSuccess, onError);
    const defaultSettings = {
        cycleLength: 28,
        plusMinus: 3,
        threshold: 5,
        useDefaults: false
    }
    return(
    <form>
        <div className="flex flex-col gap-2 w-xs">
            <div className="flex justify-between">
                <label htmlFor="length">Period length: </label>
                <input className="data-entry" id="length" type="number" value={settings.cycleLength} onChange={e => setSettings( (prev: SettingsData) => ({...prev, cycleLength: parseInt(e.target.value)}))}/>
            </div>
            <div className="flex justify-between">
                <label htmlFor="plusMinus">+-: </label>
                <input className="data-entry" id="plusMinus" type="number" value={settings.plusMinus} onChange={e => setSettings( (prev: SettingsData) => ({...prev, plusMinus: parseInt(e.target.value)}))}/>
            </div>
            <div className={`flex ${settings.useDefaults ? "hidden" : ""} justify-between`}>
                <label htmlFor="threashold">Threshold: </label>
                <input className="data-entry" id="threshold" type="number" value={settings.threshold} onChange={e => setSettings( (prev: SettingsData) => ({...prev, threshold: parseInt(e.target.value)}))}/>
            </div>
            <div className="flex justify-between">
                <label htmlFor="useDefaults">Always use these settings </label>
                <input className="data-entry" id="useDefaults" type="checkbox" checked={settings.useDefaults} onChange={e => setSettings( (prev: SettingsData) => ({...prev, useDefaults: e.target.checked}))}/>
            </div>
            <div className="flex gap-2 justify-center">
                <button className="btn-primary" onClick={e => {e.preventDefault(); mutation.mutate(settings)}} disabled={!isValid}>Save changes</button>
                <button className="btn-primary" onClick={e => {e.preventDefault(); setSettings(defaultSettings)}}>Restore defaults</button>
                <button className="btn-primary" onClick={e => {e.preventDefault(); navigate("/")}}>Cancel</button>
            </div>
            <div className="self-center mt-6">
                <DeleteUserButton setErrorText={setErrorText}/>
            </div>
        </div>
    </form>)
}