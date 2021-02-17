import {useState, useEffect} from 'react';

interface Props {
    time: number,
    handleTimesUp: any,
    start: boolean,
}

export default function Timer(props: Props){
    const [seconds, setSeconds] = useState(props.time);

    useEffect(() => {
        let interval: any = null;
        if (seconds === 0) {
            props.handleTimesUp();
        } else if(props.start){
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        } 
        if(!props.start){
            clearInterval(interval); 
        } 
        return () => clearInterval(interval); 
    }, [seconds])


    return (
        <div>
            <p className="text-2xl">{seconds !== 0 ? seconds : "Times Up!"}</p>
        </div>
    )
}