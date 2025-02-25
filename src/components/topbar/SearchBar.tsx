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

    useEffect(() => {
        const split = currentDirectoryPath.split("\\");
        setCurrentPlace(split[split.length - 2]);
    }, [currentDirectoryPath])

    async function onSearch() {
        if (currentVolume.length == 0) {
            alert("Please select a volume before searching");
            return;
        }
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