import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchResults, setError } from "../../state/searchSlice";
import Input, { InputSize } from "../Input";
import { RootState } from "../../state/store/store";1
import { search_files } from "../../IPC/IPCRequests";
import { useNavigate } from "react-router";

interface Props {
    currentVolume: string;
}

export interface ISearchFilter {
    extension: string;
    acceptFiles: boolean;
    accepptDirectories: boolean;
}

export default function SearchBar({
    currentVolume
} : Props) {
    const [searchValue, setSearchValue] = useState("")
    // const [searchFilter, setSearchFilter] = useState<ISearchFilter>({
    //     extension: "",
    //     acceptFiles: true,
    //     accepptDirectories: true
    // })

    const [loading, setLoading] = useState(false);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchResult = useSelector((state: RootState) => state.search.searchResults);

    async function onSearch() {
        if (currentVolume.length === 0) {
            alert("Please select a volume before searching");
            return;
        }

        console.log("Volume:", currentVolume);

        try {
            setLoading(true);
            const res = await search_files(currentVolume, searchValue);
            console.log("searchResult", res)
            if (res.length > 0) {
                dispatch(setSearchResults(res));
                setError("");
            } else {
                setError("No results found");
            }
        } catch (err) {
            setError(err as string);
        }
    }

    useEffect(() => {
        if (searchResult.length > 0) {
            navigate('/results', {
                state: {
                    searchResult: searchResult,
                    currentVolume: currentVolume
                }
            });
        }
    }, [searchResult])

    return (
        <div className="absolute right-4 top-16">
            <Input 
                value={searchValue}
                setValue={setSearchValue}
                placeholder={`Search ${currentVolume} || "PC"`}
                className="rounded-bl-none rounded-br-none"
                onSubmit={onSearch}
                size={InputSize.Large}
            />
        </div>
    )
}