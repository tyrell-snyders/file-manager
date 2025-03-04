import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchResults, setError } from "../../state/searchSlice";
import { invoke } from "@tauri-apps/api/core";
import Input, { InputSize } from "../Input";
import useNavigation from "../../hooks/useNavigation";
import { RootState } from "../../state/store/store";

interface Props {
    currentVolume: string;
    currentDirectoryPath: string;
}

export interface ISearchFilter {
    extension: string;
    acceptFiles: boolean;
    accepptDirectories: boolean;
}

export default function SearchBar({
    currentDirectoryPath,
    currentVolume
} : Props) {
    const [searchValue, setSearchValue] = useState("")
    // const [searchFilter, setSearchFilter] = useState<ISearchFilter>({
    //     extension: "",
    //     acceptFiles: true,
    //     accepptDirectories: true
    // })

    const [currentPlace, setCurrentPlace] = useState<string | undefined>()
    const [loading, setLoading] = useState(false);
    

    const dispatch = useDispatch();
    const { navigate } = useNavigation();
    const searchResult = useSelector((state: RootState) => state.search.searchResults);

    useEffect(() => {
        const split = currentDirectoryPath.split("\\");
        setCurrentPlace(split[split.length - 2]);
    }, [currentDirectoryPath])

    async function onSearch() {
        if (currentVolume.length === 0) {
            alert("Please select a volume before searching");
            return;
        }

        try {
            setLoading(true);
            const res: string[] = await invoke("search_file", {
                path: currentVolume,
                query: searchValue
            });

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
        const directory = searchResult.map(result => result.slice(0, result.lastIndexOf("S")))
        if (searchResult.length > 0) {
            navigate(directory[0]);
        }
    }, [searchResult])

    return (
        <div className="absolute right-4 top-4">
            <Input 
                value={searchValue}
                setValue={setSearchValue}
                placeholder={`Search ${currentPlace} || "PC"`}
                className="rounded-bl-none rounded-br-none"
                onSubmit={onSearch}
                size={InputSize.Large}
            />
        </div>
    )
}