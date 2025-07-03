import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router";

export default function RedirectPage() {

    const [time, setTime] = useState<number>(3);
    const navigate = useNavigate();

    useEffect(() =>{
        const countDown = setInterval(() =>{
            setTime((prev: number): number => prev - 1);
        }, 1000)

        return () => clearInterval(countDown);
    },[])

    useEffect(() => {
        if (time === 0) {
            navigate("/");
        }
    }, [time, navigate]);

    return (
        <div>User session expired. Redirecting to <Link to="/"> main page </Link> in... {time}</div>
    )
}
