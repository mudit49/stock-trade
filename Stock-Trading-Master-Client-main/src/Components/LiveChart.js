import FormatChart from "./FormatChart";
import ReactApexChart from "react-apexcharts";

// const apiKey=process.env.key
//beacause we have limited amount of api calls ie. 25 per day so i am using demo api
function LiveChart ({stockData}) {
    
    
    const candleStickOptions = {
        chart: {
            type: "candlestick",
        },
        title: {
            text: "CandleStick Chart",
            align: "left",
        },
        xaxis: {
            type: "datetime",
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
        },
    };
    const plotData = FormatChart({stockData});
    return (
        <ReactApexChart
            series={
                [
                    {
                        data: plotData
                    }
                ]
            }
            options={candleStickOptions}
            type="candlestick"
        />
    );
}

export default LiveChart;