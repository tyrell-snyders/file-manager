import {Dispatch, SetStateAction, useEffect, useState} from "react";
import { invoke } from "@tauri-apps/api/core";
import Input, { InputSize } from "../Input";

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
    const [searchFilter, setSearchFilter] = useState<ISearchFilter>({
        extension: "",
        acceptFiles: true,
        accepptDirectories: true
    })

    const [currentPlace, setCurrentPlace] = useState<string | undefined>()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<string[]>([]);

    useEffect(() => {
        const split = currentDirectoryPath.split("\\");
        setCurrentPlace(split[split.length - 2]);
    }, [currentDirectoryPath])

    async function onSearch() {
        if (currentVolume.length == 0) {
            alert("Please select a volume before searching");
            return;
        }

        try {
            const res: string[] = await invoke("search_file", {
                path: currentVolume,
                query: searchValue
            })
            setLoading(true);
            if (res.length > 0) {
                setSearchResults([]);
                setError("No results found");
                setLoading(false);
            }

            setSearchResults(res);
            setError(null);
        } catch (err) {
            setError(err as string);
            alert(err);
        }

        setLoading(false);
        console.log(searchResults);
    }


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