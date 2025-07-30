import { useMutation } from "@tanstack/react-query"
import { putSettingsData } from "../../model/API/settingsData"

export const usePutSettingsMutation = (putSuccess: () => void, putFail: (error: Error) => void) => {
    return useMutation({
        mutationFn: putSettingsData,
        onSuccess: () => {
            putSuccess();
        },
        onError: (error) => {
            putFail(error);
        }
    });
}