import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <div className="flex flex-col gap-1 items-center">
            <h2>Page not found</h2>
            <p>The page or resource you are looking for does not exist.</p>
            <Link to={"/"}>Back to main page</Link>
        </div>
    );
}
