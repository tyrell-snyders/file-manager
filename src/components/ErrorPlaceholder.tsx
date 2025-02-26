export default function ErrorPlaceholder({ error } : { error: string}) {
    return (
        <p style={{ color: "red" }}>Error: {error}</p>
    )
}