import useNavigation from "../hooks/useNavigation";

export default function VolumePage({ volumePath }: { volumePath: string }) {
    const { onBackArrowClick } = useNavigation();

    return (
        <div>
            <h1>Volume: {volumePath}</h1>
            <button onClick={onBackArrowClick}>Back</button>
        </div>
    )
}