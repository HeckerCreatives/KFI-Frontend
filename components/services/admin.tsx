import { useQuery } from "@tanstack/react-query";
import kfiAxios from "../utils/axios";
import { useDebounce } from "../utils/debounce";
import { TTableFilter } from "../../types/types";
import { TUser } from "../pages/dashboard/admin/Admin";

export const getUserList = async (data: TTableFilter): Promise<TUser> => {
    const response = await kfiAxios.get("/user", { params: data });
    return response.data;
};

export const useGetUserList = (data: TTableFilter, online: boolean) => {
    const debounceSearch = useDebounce(data.search, 500);

    return useQuery({
        queryKey: ["user-list", { ...data, search: debounceSearch }],
        queryFn: () => getUserList({ ...data, search: debounceSearch }),
        retry: false,
        enabled: online,
    });
};