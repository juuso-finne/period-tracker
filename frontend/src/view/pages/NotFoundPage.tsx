import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <>
            <h1>Page not found</h1>
            <p>The page or resource you are looking for does not exist.</p>
            <Link to={"/"}>Back to main page</Link>
        </>
    );
}
