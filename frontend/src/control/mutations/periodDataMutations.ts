import { useMutation } from "@tanstack/react-query"
import { postPeriodData, putPeriodData, deletePeriodData} from "../../model/API/periodData"

export const usePostPeriodMutation = (postSuccess: () => void, postFail: (error: Error) => void) => {
    return useMutation({
        mutationFn: postPeriodData,
        onSuccess: () => {
            postSuccess();
        },
        onError: (error) => {
            postFail(error);
        }
    });
}

export const usePutPeriodMutation = (putSuccess: () => void, putFail: (error: Error) => void) => {
    return useMutation({
        mutationFn: putPeriodData,
        onSuccess: () => {
            putSuccess();
        },
        onError: (error) => {
            putFail(error);
        }
    });
}

export const useDeletePeriodMutation = (deleteSuccess: () => void, deleteFail: (error: Error) => void) => {
    return useMutation({
        mutationFn: deletePeriodData,
        onSuccess: () => {
            deleteSuccess();
        },
        onError: (error) => {
            deleteFail(error);
        }
    });
}