import { CirclesWithBar } from 'react-loader-spinner'

export const circlesWithBar = () => {
    return (
        <div
            style={{
                position: "relative", top: "5rem", left: "5rem"
            }}
        >
            <CirclesWithBar
                height="100"
                width="100"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                outerCircleColor=""
                innerCircleColor=""
                barColor=""
                ariaLabel='circles-with-bar-loading'
            />
        </div>
    )
}