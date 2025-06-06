/* TODO: This component must display 2 new buttons after it has been clicked on.
        The 2 buttons should be:
            -> Folder
            -> File
        When the user clicks on one of those buttons a drawer will pop up
        and prompt the user to enter the folder/file name and the file type
*/

export default function AddButton() {
    return (
        <button disabled>
            <h1 className="text-lg font-bold">+</h1>
        </button>
    );
}