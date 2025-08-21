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
        <h2>Settings</h2>
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
    const [showHelp, setShowHelp] = useState<boolean>(false);
    const mutation = usePutSettingsMutation(onSuccess, onError);
    const defaultSettings = {
        cycleLength: 28,
        plusMinus: 3,
        threshold: 5,
        useDefaults: false
    }
    return(
        <form>
            <div className="flex flex-col gap-2 max-w-xs">
                <HelpText showHelp={showHelp}/>
                <button
                    className="btn-primary self-center mb-2"
                    onClick={e => {
                        e.preventDefault();
                        setShowHelp((prev) => !prev)
                    }}
                >
                    {`${showHelp ? "Hide" : "Show"} help`}
                </button>
                <div className="flex justify-between">
                    <label htmlFor="length">Cycle length: </label>
                    <input className="data-entry shrink" id="length" type="number" value={settings.cycleLength} onChange={e => setSettings( (prev: SettingsData) => ({...prev, cycleLength: parseInt(e.target.value)}))}/>
                </div>
                <div className="flex justify-between">
                    <label htmlFor="plusMinus">+-: </label>
                    <input className="data-entry shrink" id="plusMinus" type="number" value={settings.plusMinus} onChange={e => setSettings( (prev: SettingsData) => ({...prev, plusMinus: parseInt(e.target.value)}))}/>
                </div>
                <div className={`flex ${settings.useDefaults ? "hidden" : ""} justify-between`}>
                    <label htmlFor="threashold">Threshold: </label>
                    <input className="data-entry shrink" id="threshold" type="number" value={settings.threshold} onChange={e => setSettings( (prev: SettingsData) => ({...prev, threshold: parseInt(e.target.value)}))}/>
                </div>
                <div className="flex justify-between">
                    <label htmlFor="useDefaults">Always use these settings </label>
                    <input className="data-entry" id="useDefaults" type="checkbox" checked={settings.useDefaults} onChange={e => setSettings( (prev: SettingsData) => ({...prev, useDefaults: e.target.checked}))}/>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-stretch">
                    <button className="btn-save" onClick={e => {e.preventDefault(); mutation.mutate(settings)}} disabled={!isValid}>Save changes</button>
                    <button className="btn-primary" onClick={e => {e.preventDefault(); setSettings(defaultSettings)}}>Restore defaults</button>
                    <button className="btn-primary" onClick={e => {e.preventDefault(); navigate("/")}}>Cancel</button>
                </div>
                <div className="self-center mt-6">
                    <DeleteUserButton setErrorText={setErrorText}/>
                </div>
            </div>
        </form>
    )
}

function HelpText({showHelp}:{showHelp: boolean}){
    return(
            <div className={`mb-5 flex flex-col gap-2 min-w-0 ${showHelp ? "" : "hidden"}`}>
                <p>
                    Normally, this app makes predictions about the user's next cycle based on prior data. These settings determine default values that are used instead, if the data is not sufficient.
                </p>

                <ul className="list-disc list-outside">
                    <li>
                        <span className="font-bold">Cycle length:</span> The number of days between cycles. If your cycle has started on Jan 1st, and this number is 28, your next cycle will be predicted to begin on Jan 29th.
                    </li>

                    <li>
                        <span className="font-bold">+-:</span> This is the error margin of the prediction. In the above example, if this value is 3, the prediction will be between Jan 26th and Feb 1st.
                    </li>

                    <li>
                        <span className="font-bold">Threshold:</span> This is the number of cycles required for making predictions based on actual data. If the number of cycles is lower, these values are used. If the checkbox below is selected, the predictions will always be based on these values instead of the data.
                    </li>
                </ul>
            </div>
    )
}